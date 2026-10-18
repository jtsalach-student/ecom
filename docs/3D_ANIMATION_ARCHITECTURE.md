# Cinematic 3D Disassembly Engine Architecture

## 1. Core Principles
1. **Model-Specific Geometry**: Each animated device corresponds to the exact hardware revision (e.g. iPhone 16 Pro Max A3296), never generic phone recolors.
2. **Scroll Pacing**: Disassembly transforms and camera orbits are driven by normalized scroll progress ($0.0 \le t \le 1.0$) with smooth interpolation.
3. **Accessibility & Graceful Degradation**:
   - Devices without WebGL support automatically fall back to high-resolution verified photography and technical specification callouts (`FallbackViewer`).
   - Users with `prefers-reduced-motion` have animations disabled with static interactive inspection steps.

---

## 2. Component Explosion Hierarchy
For the flagship Apple iPhone 16 Pro Max:
- **Stage 1 (Chassis)**: Grade 5 Titanium exterior frame laser-welded to aluminum substructure.
- **Stage 2 (Display)**: 6.9" Super Retina XDR OLED with Gen 2 Ceramic Shield.
- **Stage 3 (Power)**: High-density 4,685 mAh steel-cased battery cell.
- **Stage 4 (Optics)**: 48MP Fusion quad-pixel sensor and 5x optical tetraprism folded-glass module.
- **Stage 5 (Logic)**: High-density interconnect motherboard featuring the Apple A18 Pro 3nm SoC.
