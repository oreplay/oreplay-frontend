/**
 * Error thrown when a relay computation needs the legs of a team that has none.
 *
 * A team without members is valid data (for example, a vacant entry in the start list), so
 * callers that can fall back to another criterion catch this error instead of reporting it.
 *
 * @extends {Error}
 */
export class MissingTeamMembersError extends Error {
  /**
   * Creates the error with the message shared by every relay computation.
   */
  constructor() {
    super("A relay runner is expected to have team members")
    this.name = "MissingTeamMembersError"
  }
}
