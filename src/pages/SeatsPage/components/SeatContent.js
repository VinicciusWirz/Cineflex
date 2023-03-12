import { SeatItem } from "../styled";

export default function SeatContent({ availability, seatNumber, selectSeat, seatId, buyers }) {
    const seatAvailability = !availability ? 'unavailable' : !buyers.some((client) => client.id === seatId) ? 'available' : 'selected';
    return (
        <>
            <SeatItem data-test="seat" option={seatAvailability} onClick={() => selectSeat(seatId, seatNumber, availability)}>
                {seatNumber}
            </SeatItem>
        </>
    );
}