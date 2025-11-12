# SCADA Industrial Icons

Place industrial SCADA icons in this directory.

## Required Icons

### Sensors & Meters
- CT (Current Transformer)
- VT (Voltage Transformer)
- Power Meter
- PMU (Phasor Measurement Unit)
- 4-20mA Sensor

### Equipment
- Transformer
- Breaker (Open/Close)
- Inverter
- PLC/RTU
- Edge Gateway

### DER Assets
- Solar PV Panel
- Wind Turbine
- Battery (BESS)
- Diesel Generator
- Gas Turbine

### System Components
- Feeder
- Substation
- Historian/Database
- AI/Brain Icon
- Server

### Status Indicators
- Alarm
- Loading/Progress
- Overload
- Online/Offline

## Icon Format

- Format: SVG preferred (scalable)
- Size: 64x64px or larger
- Style: Industrial flat design
- Color: Monochrome (can be colored via CSS)

## Usage

Icons can be imported and used in components:

```tsx
import Image from "next/image";

<Image
  src="/scada-icons/pv-panel.svg"
  alt="PV Panel"
  width={64}
  height={64}
/>
```

Or via CSS background:

```css
.icon-pv {
  background-image: url('/scada-icons/pv-panel.svg');
}
```

## License

Icons should be sourced from:
- FlatIcon Industrial Pack
- Custom created icons
- Open source icon libraries

Ensure proper licensing for production use.
