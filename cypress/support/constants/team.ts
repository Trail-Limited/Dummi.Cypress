import { Adviser, Adviser1, Adviser2, Adviser3, Adviser4 } from "./adviser";

class Team {
    Id: Number;
    Name: String;
    Advisers: Array<Adviser>;
}

export const Team1 : Team = {
    Id: 207,
    Name: "VN Dev Team",
    Advisers: [Adviser1, Adviser2]
}

export const Team2 : Team = {
    Id: 209,
    Name: "Integration Testing Team 2",
    Advisers: [Adviser3, Adviser4]
}