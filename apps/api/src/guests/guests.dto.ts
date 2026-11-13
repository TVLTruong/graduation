export type CreateGuestDto = {
  name: string;
  title: string;
  type: string;
};

export type UpdateRsvpDto = {
  isAttending: boolean;
  wish?: string;
};

// RSVP from the shared /invite/all link, which has no guest record yet
export type SharedRsvpDto = UpdateRsvpDto & {
  name: string;
};
