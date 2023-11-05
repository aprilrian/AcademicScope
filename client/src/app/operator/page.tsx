export default function sidebar({ }) {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100">
      <form
        className="relative w-[1460px] min-h-[800px] bg-white rounded-[25px] flex flex-col items-left"
        style={{ marginTop: '20px', marginBottom: '40px', paddingBottom: '40px' }}
      >
        <div>
            <div className="left-0 top-0 text-black text-base font-normal font-['Inter']">Username/email</div>
            <input
              type="text"
              className="w-[560px] h-[60px] bg-white rounded-[10px] border border-neutral-200 text-black"
              style={{ paddingLeft: '10px' }}
              placeholder="Username/email"
            />
          </div>
        </form>
      </main>
    </div>
  );
}