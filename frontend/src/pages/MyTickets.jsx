import MainLayout from "../layout/MainLayout";
import Transparent_card from "../components/Transparent_card";
import Button from "../components/Button";
import {
  CALENDAR_ICON,
  TIME_ICON,
  CHAIR_ICON,
  USER_ICON,
  CINEMA_ICON,
} from "../utils/constants";
const dataMyTickets = [
  {
    movieName: "Avengers: Endgame",
    showTime: "19:30 ngày 25/12/2024",
    seats: ["A1", "A2", "A3"],
    customerName: "Trần Văn A",
    bookingDate: "25/12/2024",
  },
  {
    movieName: "Avengers: Endgame",
    showTime: "19:30 ngày 25/12/2024",
    seats: ["A1", "A2", "A3"],
    customerName: "Trần Văn A",
    bookingDate: "25/12/2024",
  },
  {
    movieName: "Avengers: Endgame",
    showTime: "19:30 ngày 25/12/2024",
    seats: ["A1", "A2", "A3"],
    customerName: "Trần Văn A",
    bookingDate: "25/12/2024",
  },
];

function MyTickets() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">My Tickets Page</h1>
      <Transparent_card className="p-6 w-1/3 mx-auto">
        <p className="text-lg font-semibold">Trần Văn A</p>
      </Transparent_card>
      <div className="grid grid-cols-3 gap-6 mt-6">
        {dataMyTickets.map((ticket, index) => (
          <Transparent_card key={index} className="p-6">
            <div className="space-y-4 flex flex-col">
              <p className="space-x-2 flex items-center">
                <img
                  src={CINEMA_ICON.src}
                  alt={CINEMA_ICON.alt}
                  width={CINEMA_ICON.width}
                  height={CINEMA_ICON.height}
                />
                <span>Tên phim: {ticket.movieName}</span>
              </p>
              <p className="space-x-2 flex items-center">
                <img
                  src={TIME_ICON.src}
                  alt={TIME_ICON.alt}
                  width={TIME_ICON.width}
                  height={TIME_ICON.height}
                />
                <span>Giờ chiếu: {ticket.showTime}</span>
              </p>
              <p className="space-x-2 flex items-center">
                <img
                  src={CHAIR_ICON.src}
                  alt={CHAIR_ICON.alt}
                  width={CHAIR_ICON.width}
                  height={CHAIR_ICON.height}
                />
                <span>Ghế đã đặt: {ticket.seats.join(", ")}</span>
              </p>
              <p className="space-x-2 flex items-center">
                <img
                  src={USER_ICON.src}
                  alt={USER_ICON.alt}
                  width={USER_ICON.width}
                  height={USER_ICON.height}
                />
                <span>Tên khách hàng: {ticket.customerName}</span>
              </p>
              <p className="space-x-2 flex items-center">
                <img
                  src={CALENDAR_ICON.src}
                  alt={CALENDAR_ICON.alt}
                  width={CALENDAR_ICON.width}
                  height={CALENDAR_ICON.height}
                />
                <span>Ngày đặt vé: {ticket.bookingDate}</span>
              </p>
            </div>
          </Transparent_card>
        ))}
      </div>
      <Button variant="accent" className="mt-6">
        Trở về trang chủ
      </Button>
    </MainLayout>
  );
}
export default MyTickets;
