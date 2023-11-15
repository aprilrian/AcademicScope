import RekapStatistik from "../../components/charts/RekapStatistik";

export default function DataPKL() {
  return (
    <> 
      <RekapStatistik label={"Skripsi"} API={`${process.env.BACKEND_API}/all-skripsi`} role={'departemen'}/>
    </>
  );
}
