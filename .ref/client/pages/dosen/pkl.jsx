import RekapStatistik from "../../components/charts/RekapStatistik";

export default function DataPKL() {
  return (
    <>
      <RekapStatistik
        role={'dosen'}
        label={"PKL"}
        API={`${process.env.BACKEND_API}/rekap/pkl`}
      />
    </>
  );
}
