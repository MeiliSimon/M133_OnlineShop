/// <reference lib="dom" />

import { Person } from "../common/types.ts";

export async function loadDetail() {
    const personId = new URLSearchParams(window.location.search).get("personId"); 
    const response = await fetch(`/api/persons/${personId}`);
    const person: Person = await response.json();

    document.querySelector("h1").innerText = `${person.firstName} ${person.lastName}`;
    document.querySelector("span").innerText = person.id;
}