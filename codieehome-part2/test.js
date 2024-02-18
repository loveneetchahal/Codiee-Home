const fetch = require("node-fetch");

async function getMeetings() {
  const bar =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImFXaXcxT1dNUy0yUV9IWmZkdjRyWUEiLCJleHAiOjE2MTYyNTc3ODYsImlhdCI6MTYxNTY1Mjk4Nn0.OCXr1a1Iw5mMkP1aEHCF2BBC7IHaOW96PA0ekdD6VCg";

  const meetingsZoom = await fetch(`https://api.zoom.us/v2/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bar}`,
    },
  });
  const person = await meetingsZoom.json();
  // console.log(person)

  const meet = await fetch(
    `https://api.zoom.us/v2/users/${person.id}/meetings`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bar}`,
      },
    }
  );
  const meetings = await meet.json();
//   console.log(meetings); return;
  const allusers = await fetch(`https://api.zoom.us/v2/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bar}`,
    },
  });
  console.log(allusers);
}

getMeetings();
