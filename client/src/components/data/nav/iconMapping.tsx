interface IconMapping {
  [key: string]: JSX.Element;
}

const iconMapping: IconMapping = {
  Dashboard: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 5C16 4.06812 16 3.60218 16.1522 3.23463C16.3552 2.74458 16.7446 2.35523 17.2346 2.15224C17.6022 2 18.0681 2 19 2C19.9319 2 20.3978 2 20.7654 2.15224C21.2554 2.35523 21.6448 2.74458 21.8478 3.23463C22 3.60218 22 4.06812 22 5V9C22 9.93188 22 10.3978 21.8478 10.7654C21.6448 11.2554 21.2554 11.6448 20.7654 11.8478C20.3978 12 19.9319 12 19 12C18.0681 12 17.6022 12 17.2346 11.8478C16.7446 11.6448 16.3552 11.2554 16.1522 10.7654C16 10.3978 16 9.93188 16 9V5Z"
        stroke="#141B34"
        stroke-width="1.5"
      />
      <path
        d="M16 19C16 18.0681 16 17.6022 16.1522 17.2346C16.3552 16.7446 16.7446 16.3552 17.2346 16.1522C17.6022 16 18.0681 16 19 16C19.9319 16 20.3978 16 20.7654 16.1522C21.2554 16.3552 21.6448 16.7446 21.8478 17.2346C22 17.6022 22 18.0681 22 19C22 19.9319 22 20.3978 21.8478 20.7654C21.6448 21.2554 21.2554 21.6448 20.7654 21.8478C20.3978 22 19.9319 22 19 22C18.0681 22 17.6022 22 17.2346 21.8478C16.7446 21.6448 16.3552 21.2554 16.1522 20.7654C16 20.3978 16 19.9319 16 19Z"
        stroke="#141B34"
        stroke-width="1.5"
      />
      <path
        d="M2 16C2 14.1144 2 13.1716 2.58579 12.5858C3.17157 12 4.11438 12 6 12H8C9.88562 12 10.8284 12 11.4142 12.5858C12 13.1716 12 14.1144 12 16V18C12 19.8856 12 20.8284 11.4142 21.4142C10.8284 22 9.88562 22 8 22H6C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18V16Z"
        stroke="#141B34"
        stroke-width="1.5"
      />
      <path
        d="M2 5C2 4.06812 2 3.60218 2.15224 3.23463C2.35523 2.74458 2.74458 2.35523 3.23463 2.15224C3.60218 2 4.06812 2 5 2H9C9.93188 2 10.3978 2 10.7654 2.15224C11.2554 2.35523 11.6448 2.74458 11.8478 3.23463C12 3.60218 12 4.06812 12 5C12 5.93188 12 6.39782 11.8478 6.76537C11.6448 7.25542 11.2554 7.64477 10.7654 7.84776C10.3978 8 9.93188 8 9 8H5C4.06812 8 3.60218 8 3.23463 7.84776C2.74458 7.64477 2.35523 7.25542 2.15224 6.76537C2 6.39782 2 5.93188 2 5Z"
        stroke="#141B34"
        stroke-width="1.5"
      />
    </svg>
  ),
  Profil: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
  "Data Mahasiswa": (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
  "Data PKL": (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
  "Data Skripsi": (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
  "Verifikasi Berkas": (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
  IRS: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
  KHS: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
  PKL: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
  Skripsi: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
  "Generate Akun": (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
  "Manajemen Akun": (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 13h8v-2H8v2zm8-4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1z" />
    </svg>
  ),
};

export { iconMapping };
