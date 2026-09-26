# WhatBin Sanity Studio

Sanity Studio for WhatBin's source-backed disposal rules.

## Local development

Run `npm run dev` from this directory.

## Dataset

- Project: `xqeddep2`
- Dataset: `production` (public published content)
- Published mattress rules: `old-mattress-hanoi` and `old-mattress-ho-chi-minh-city`
- Published fluorescent-lamp rules: `used-fluorescent-lamp-hanoi` and `used-fluorescent-lamp-ho-chi-minh-city`
- Published mercury-thermometer rules: `used-mercury-thermometer-hanoi` and `used-mercury-thermometer-ho-chi-minh-city`
- Published standalone lithium-ion battery rules: `used-lithium-ion-battery-hanoi` and `used-lithium-ion-battery-ho-chi-minh-city`
- No power-bank rules are published. Current applicable city decisions do not establish a general route for intact power banks. An official [2023 Ministry of Agriculture and Environment report](https://vea.mae.gov.vn/tin-tuc-su-kien/8192/lan-toa-tinh-than-bao-ve-moi-truong) describes local Hanoi “Nhà của pin” programs collecting old batteries and broken power banks; this dated local-program report does not establish current citywide acceptance. `used-power-bank` remains `UNKNOWN` in both cities.

Do not add ward-level locations, hours, or fees without a current official source.
