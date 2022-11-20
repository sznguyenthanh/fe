import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Link to="/data">
        <button className="xem-du-lieu">Xem du lieu</button>
      </Link>
    </div>
  );
}
