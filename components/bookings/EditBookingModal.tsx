import React from "react";
import { Booking } from "@/lib/mockData";
import { BookingWizardModal } from "@/components/bookings/BookingWizardModal";

interface EditBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdated: (updated: Booking) => void;
}

export function EditBookingModal({
  booking,
  isOpen,
  onClose,
  onBookingUpdated,
}: EditBookingModalProps) {
  return (
    <BookingWizardModal
      isOpen={isOpen}
      onClose={onClose}
      bookingToEdit={booking}
      onBookingUpdated={onBookingUpdated}
    />
  );
}
