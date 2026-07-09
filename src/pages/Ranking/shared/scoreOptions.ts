// Score-override choices offered as selects. `null` means "empty / no override".

// Non-competitive (nc_true / nc_false): either an explicit 0 or empty.
export const NC_SCORE_VALUES = [null, 0] as const

// Per-status score overrides.
export const STATUS_SCORE_VALUES = [null, 0, 10, 15, 50, 100] as const
