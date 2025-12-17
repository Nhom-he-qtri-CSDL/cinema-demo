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
function BookingResult({ success = true }) {
  return (
    <>
      <MainLayout>
        <div className="flex flex-col items-center space-y-6">
          <div
            className={`text-center bg-[var(--light-color)] border rounded-lg p-6 ${
              success
                ? "border-[var(--success-color)] text-[var(--success-color)]"
                : "border-[var(--danger-color)] text-[var(--danger-color)]"
            }`}
          >
            <h2 className="text-2xl font-semibold">
              {success ? "Đặt vé thành công!" : "Đặt vé thất bại!"}
            </h2>
          </div>
          <Transparent_card className="p-10 text-[var(--light-color)]">
            {success && (
              <div className="space-y-4 flex flex-col">
                <p className="space-x-2 flex items-center">
                  <img
                    src={CINEMA_ICON.src}
                    alt={CINEMA_ICON.alt}
                    width={CINEMA_ICON.width}
                    height={CINEMA_ICON.height}
                  />
                  <span>Tên phim: Avengers: Endgame</span>
                </p>
                <p className="space-x-2 flex items-center">
                  <img
                    src={TIME_ICON.src}
                    alt={TIME_ICON.alt}
                    width={TIME_ICON.width}
                    height={TIME_ICON.height}
                  />
                  <span>Giờ chiếu: 19:30 ngày 25/12/2024</span>
                </p>
                <p className="space-x-2 flex items-center">
                  <img
                    src={CHAIR_ICON.src}
                    alt={CHAIR_ICON.alt}
                    width={CHAIR_ICON.width}
                    height={CHAIR_ICON.height}
                  />
                  <span>Ghế đã đặt: A1, A2, A3</span>
                </p>
                <p className="space-x-2 flex items-center">
                  <img
                    src={USER_ICON.src}
                    alt={USER_ICON.alt}
                    width={USER_ICON.width}
                    height={USER_ICON.height}
                  />
                  <span>Tên khách hàng: Trần Văn A</span>
                </p>
                <p className="space-x-2 flex items-center">
                  <img
                    src={CALENDAR_ICON.src}
                    alt={CALENDAR_ICON.alt}
                    width={CALENDAR_ICON.width}
                    height={CALENDAR_ICON.height}
                  />
                  <span>Ngày đặt vé: 25/12/2024</span>
                </p>
              </div>
            )}
            {!success && <p>Ghế đã được người khác đặt</p>}
          </Transparent_card>
          {success && <Button variant="accent">Xem vé của tôi</Button>}
          <Button variant="primary">Quay về trang chủ</Button>
        </div>
      </MainLayout>
    </>
  );
}
export default BookingResult;
