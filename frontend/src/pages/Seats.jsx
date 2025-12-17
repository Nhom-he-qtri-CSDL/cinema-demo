import MainLayout from "../layout/MainLayout";
import TransparentCard from "../components/Transparent_card";
import SeatGrid from "../components/SeatGrid";
import { SCREEN_IMAGE, IMAGE_EMPTY } from "../utils/constants";
import Button from "../components/Button";

function Seats() {
  return (
    <MainLayout>
      <div className="grid grid-cols-4 gap-8">
        <TransparentCard className="col-span-3 text-[var(--light-color)] flex flex-col items-center p-10">
          {/* curved "screen" */}
          <img
            src={SCREEN_IMAGE.src}
            alt={SCREEN_IMAGE.alt}
            width={SCREEN_IMAGE.width}
            height={SCREEN_IMAGE.height}
            className="mb-8 rounded-t-full"
          />
          {/* SeatGrid component */}
          <SeatGrid />
        </TransparentCard>
        <div className="flex flex-col items-center space-y-4 col-span-1">
          <img
            src={IMAGE_EMPTY.src}
            alt={IMAGE_EMPTY.alt}
            width={IMAGE_EMPTY.width}
            height={IMAGE_EMPTY.height}
            className="mx-auto mb-4"
          />
          <TransparentCard className="w-full text-center text-[var(--light-color)] p-6">
            <h2 className="text-2xl font-semibold mb-2">Ghế đã chọn</h2>
            <p>Chưa có ghế nào được chọn.</p>
          </TransparentCard>
          <TransparentCard className="w-full text-center text-[var(--light-color)] p-6">
            <p className="text-xl font-semibold mb-2">Trần Văn A</p>
          </TransparentCard>
          <Button
            onClick={() => {
              // Tạm thời chuyển đến trang kết quả
              window.location.href = "/booking-result";
            }}
            variant="success"
            className="w-full py-3 rounded-lg mt-4"
          >
            Đặt vé
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
export default Seats;
