import { SeatItem } from "../styled";

export default function SeatContent({ availability, seatNumber, selectedSeats, selectSeat, seatId }) {
    const seatAvailability = !availability ? 'unavailable' : !selectedSeats.includes(seatId) ? 'available' : 'selected';
    return (
        <>
            <SeatItem data-test="seat" option={seatAvailability} onClick={() => selectSeat(seatId, seatNumber, availability)}>
                {seatNumber}
            </SeatItem>
        </>
    );
}