import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar";
import { navlinks } from "../data/staticdata.js";
import Heading from "../components/Heading";
import mapping from "../city_num_mapping.json"
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { Link } from "react-router-dom";

const base_url = "https://www.getyourguide.com"

const PopularPlaces = () => {
    const [to, setTo] = useState("");
    const [attraction, setAttraction] = useState([]);
    function handleTo(e) {
        setTo(e.target.value);
    }
    useEffect(() => {
        setAttraction([]);

        async function getAttractions() {
            // console.log(mapping.list)
            // console.log(to)
            let index = to
            await fetch(`https://travelers-api.getyourguide.com/locations/${index}/seo-links`, {
                "credentials": "omit",
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US",
                    "accept-currency": "INR",
                    "geo-ip-country": "IN",
                    "x-gyg-geoip-country": "IN",
                    "x-gyg-app-type": "Web",
                    "x-allow-cache": "true",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-site"
                },
                "referrer": "https://www.getyourguide.com/",
                "method": "GET",
                "mode": "cors"
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    // console.log(data)
                    Object.values(data.seoLinks.poi.sections[0]['items']).forEach((info) => {
                        const placeInfo = {
                            label: info['label'],
                            img: info['image'],
                            url: info['url']
                        };
                        // console.log(placeInfo);
                        setAttraction((prev) => {
                            return [...prev, placeInfo];
                        });
                    });
                });
        }
        getAttractions();
    }, [to]);
    return (
        <div>
            <Navbar navlinks={navlinks} />
            <Heading heading="Popular Places" />
            <div className="relative py-7 md:pt-3 bg-gradient-to-r from-emerald-50 to-green-100">

                <FormControl variant="filled" sx={{ m: 1, minWidth: 180 }}>

                    <InputLabel id="demo-simple-select-standard-label">
                        Destination
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={to}
                        onChange={handleTo}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                    >
                        {mapping.list.map((city) => {
                            return (
                                <MenuItem value={`${city.index}`}>
                                    {city.city}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </div>
            {
                <div className="grid items-center grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5">
                    {attraction.map((val, i) => (
                        <Link to={base_url + val.url} target="_blank">
                            <div
                                key={i}
                                className="flex items-center gap-5 rounded-lg hover:bg-emerald-300 transition-all duration-300 cursor-pointer hover:scale-105"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={val.image}
                                        alt={val.label}
                                        className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg filter drop-shadow-lg"
                                    />
                                </div>
                                <div className="flex items-start flex-col text-slate-900">
                                    <h1 className="text-lg sm:text-sm font-bold">
                                        {val.label}
                                    </h1>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            }
        </div>
    )
}

export default PopularPlaces