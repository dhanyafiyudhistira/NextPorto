# SCADA Industrial Icons

This directory should contain industrial SCADA icons from FlatIcon Industrial Pack.

## Required Icons

Download icons for the following components:

### Field Devices
- `ct.svg` - Current Transformer
- `vt.svg` - Voltage Transformer
- `power-meter.svg` - Power Meter
- `pmu.svg` - Phasor Measurement Unit
- `transformer.svg` - Transformer

### DER (Distributed Energy Resources)
- `solar-panel.svg` - Solar PV
- `wind-turbine.svg` - Wind Turbine
- `battery.svg` - Battery Energy Storage System (BESS)
- `generator.svg` - Generator Set

### Control Devices
- `inverter.svg` - Inverter
- `breaker-open.svg` - Circuit Breaker (Open)
- `breaker-close.svg` - Circuit Breaker (Closed)

### Infrastructure
- `substation.svg` - Substation
- `feeder.svg` - Feeder Line
- `rtu.svg` - Remote Terminal Unit
- `plc.svg` - Programmable Logic Controller

### System Components
- `database.svg` - Historian Database
- `ai-brain.svg` - AI/Optimization Engine
- `alarm.svg` - Alarm/Alert
- `loading.svg` - Loading Indicator
- `overload.svg` - Overload Warning

## Icon Guidelines

- **Format**: SVG (scalable vector graphics)
- **Size**: 64x64px or higher
- **Style**: Industrial/technical aesthetic
- **Color**: Use `currentColor` for dynamic theming
- **License**: Ensure proper licensing from FlatIcon

## Usage in Components

Icons can be used in React components:

```tsx
import Image from 'next/image';

<Image
  src="/scada-icons/solar-panel.svg"
  alt="Solar Panel"
  width={32}
  height={32}
  className="text-scada-cyan"
/>
```

Or as inline SVG with custom styling.

## Placeholder

For development, the system uses Lucide React icons as placeholders. Replace with actual industrial icons from FlatIcon for production use.

## Sources

- **FlatIcon Industrial Pack**: https://www.flaticon.com/packs/industry
- **Custom SVG**: Create custom icons matching the neon-blue cyber theme
