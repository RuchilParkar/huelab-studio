import { describe, it, expect, vi, beforeEach } from 'vitest';
import { copyToClipboard } from '../utils/clipboard';

describe('Clipboard Utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false for falsy or empty input', async () => {
    expect(await copyToClipboard('')).toBe(false);
    expect(await copyToClipboard(null as unknown as string)).toBe(false);
  });

  it('uses navigator.clipboard.writeText when available', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const success = await copyToClipboard('#A78BFA');
    expect(writeTextMock).toHaveBeenCalledWith('#A78BFA');
    expect(success).toBe(true);
  });

  it('falls back to document.execCommand when navigator.clipboard throws', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
      },
    });

    const execMock = vi.fn().mockReturnValue(true);
    document.execCommand = execMock;

    const success = await copyToClipboard('#7C5CFC');
    expect(execMock).toHaveBeenCalledWith('copy');
    expect(success).toBe(true);
  });

  it('safely returns false when both primary and fallback fail', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Blocked')),
      },
    });

    document.execCommand = vi.fn().mockImplementation(() => {
      throw new Error('execCommand disabled');
    });

    const success = await copyToClipboard('#000000');
    expect(success).toBe(false);
  });
});
