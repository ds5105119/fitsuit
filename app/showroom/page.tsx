import { GoogleDirectionsButton } from "@/components/GoogleDirectionsButton";

export const metadata = {
  title: "Contact | GOLD FINGER Tailor",
};

export default function ContactPage() {
  return (
    <main className="h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-5rem)] lg:max-h-[calc(100dvh-5rem)] mt-16 lg:mt-20 bg-white text-neutral-900">
      <div className="flex flex-col-reverse lg:flex-row h-full w-full">
        <div className="h-full lg:h-full w-full lg:w-2/3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3638.690664901466!2d127.05724199999999!3d37.512741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca46ad1ca8e71%3A0xf63856ca25d6e9fb!2z6rOo65Oc7ZWR6rGwIOu5hOyKpO2PrO2BrCDslpHrs7XsoJA!5e1!3m2!1sko!2skr!4v1765866359588!5m2!1sko!2skr"
            className="w-full h-full p-6 lg:p-0"
            loading="lazy"
          />
        </div>
        <div className="grow lg:h-full w-full lg:w-1/3 px-6 pt-6 lg:p-8 flex flex-col justify-center">
          <p className="text-xl lg:text-2xl font-medium pb-4">서울 - 파르나스</p>
          <hr className="border-neutral-600 pb-4" />
          <div className="flex justify-between pb-4">
            <div className="flex flex-col space-y-2">
              <p className="text-xs lg:text-sm">주소</p>
              <p className="text-xs lg:text-sm leading-normal">
                ​서울시 강남구 봉은사로
                <br />
                524 웨스틴 서울 파르나스
                <br />
                지하아케이드 B2 C-17
                <br />
                골드핑거 양복점
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-xs lg:text-sm">영업시간</p>
              <p className="text-xs lg:text-sm leading-normal">
                월요일: 9:30am - 19:30pm <br />
                화요일: 9:30am - 19:30pm <br />
                수요일: 9:30am - 19:30pm <br />
                목요일: 9:30am - 19:30pm <br />
                금요일: 9:30am - 19:30pm <br />
                토요일: 9:30am - 19:30pm <br />
              </p>
            </div>
          </div>
          <GoogleDirectionsButton />
        </div>
      </div>
    </main>
  );
}
