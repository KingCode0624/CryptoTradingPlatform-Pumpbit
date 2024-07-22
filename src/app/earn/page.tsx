import DashboardCard from "@/components/dashboardCard";
import EarnTabs from "@/components/earnPageTabs/earnTabs";
import StatisticsCard from "@/components/statisticsCard";

export default function Earn() {
  return (
    <div className=" pt-28 px-1  min-h-screen">
      <div className="flex items-center justify-center  pt-12 font-Raleway">
        <div className="text-center font-ArchivoBlack font-normal custom-text">
          <h1 className=" font-ArchivoBlack lg:text-8xl text-7xl uppercase  ">
            earn
          </h1>
          <p className="lg:text-6xl text-4xl  uppercase py-5  ">
            Easy Rewards Made Simple
          </p>
          <p className="lg:text-2xl text-lg font-light font-Raleway text-text">
            Earn rewards from trading fees and PBT mining.
          </p>
        </div>
      </div>
      <div className="lg:px-10 px-3 ">

        {/* <div className="pt-7 ">
          <StatisticsCard />
        </div>
        
        <div className="pt-7">
          <DashboardCard />
        </div> */}

        <div className="pt-7">
          <EarnTabs />
        </div>
      </div>
    </div>
  );
}
