# 🌎 **TuriCash DAO: Stripe Local + DAO Turística**

## 📌 Resumen

**TuriCash DAO** es una plataforma de pagos híbrida y gobernanza local diseñada
para empoderar a negocios turísticos en regiones donde el uso de efectivo, la
informalidad y las barreras al cobro digital aún prevalecen. Funciona como un
**"Stripe para efectivo y cripto"** y como una **plataforma de cobros
internacionales** para creadores y comercios locales. Un porcentaje de cada
transacción va a un fondo comunitario gobernado por los mismos negocios.

---

## 🎯 Problemas que Resuelve

### 1. Invisibilidad del Dinero en Efectivo

Los pagos en efectivo no generan data útil para planificación turística ni
prueba de ingresos para solicitar apoyo estatal o internacional.

### 2. Dificultades para Cobrar desde el Exterior

Creadores de contenido, artistas o guías turísticos locales no tienen acceso a
soluciones como Stripe o PayPal para recibir pagos globales.

### 3. Desconexión entre Ingresos y Desarrollo Turístico

Los ingresos del turismo rara vez se reinvierten de forma coordinada en mejorar
las regiones turísticas locales.

---

## 💡 Solución: TuriCash DAO

### 🔁 Procesador de Pagos Todo-en-Uno

Una plataforma para aceptar pagos:

- 💵 Efectivo (registrado vía QR por parte del comerciante)
- 💳 Tarjetas (futuro)
- 🌐 Cripto (on-chain)
- 🌍 Cobros internacionales (con wallets compatibles)

#### 🧠 Gobernanza Comunitaria

- Cada negocio que use TuriCash tiene 1 voto.
- El 2–5% de cada transacción va a un fondo común.
- Ese fondo es usado democráticamente para mejorar el turismo en la zona
  (infraestructura, promoción, eventos, etc).

---

## 🔗 Arquitectura Web3 (Chainlink-first)

### ✅ **Chainlink Functions**

- Verifican y procesan los reportes de pagos hechos en efectivo (comercios
  escanean un QR por pago).
- Ejecutan lógica condicional para distribuir fondos al DAO y a los comercios.
- Permiten consultar APIs off-chain para validar datos turísticos relevantes o
  condiciones de pago.

### 📊 **Chainlink Data Feeds**

- Proveen tasas de cambio (USD ↔️ stablecoins).
- Aseguran la conversión justa de valores en el sistema multimoneda.
- Garantizan precios en tiempo real para reportes y registros.

---

## 📦 MVP en 1 Semana

**Scope del MVP (abril 2025):**

1. Interfaz simple para comercios que:
   - Registren cobros manualmente (botón “Pago recibido” con monto).
   - Generen su QR de negocio.
2. Script con **Chainlink Functions** para:
   - Registrar datos del pago on-chain.
   - Enviar el % al wallet multisig del DAO.
3. Uso de **Chainlink Data Feeds** para tasas de cambio USD ↔️ stablecoin.
4. Página pública para visualizar el fondo DAO acumulado por zona.

---

## 🧭 Visión a Futuro

- Sistema de reputación y reseñas verificado.
- DAO cross-zona con fondos colaborativos para macroproyectos turísticos.
- Integración con wallets nacionales e internacionales.
- Terminal físico opcional para zonas sin acceso a smartphones.

---

## 👥 Casos de Uso

| Usuario            | Beneficio Clave                                    |
| ------------------ | -------------------------------------------------- |
| Artesano local     | Puede cobrar desde EE.UU. sin cuenta bancaria.     |
| Restaurante rural  | Registra cobros en efectivo y participa en el DAO. |
| Guía turístico     | Recibe propinas digitales o cripto.                |
| Oficina de turismo | Visualiza data y apoya el desarrollo local.        |

---

## 🌐 Pitch Final

> **TuriCash DAO transforma cada pago en una inversión para el turismo local.**\
> Ya sea en efectivo o cripto, cada transacción queda registrada, es
> verificable, y empodera a la comunidad que la recibe.

---

## **6. Hackathon Information**

### About Partners

#### BlockDAG

A next-generation blockchain protocol enabling high-throughput EVM-compatible
applications. BlockDAG provides the HackerEarth platform for this Hackathon and
supports developers building on its Primordial Testnet.

#### ETH Canal (by C10N, S.A.)

A Panamanian-led Ethereum ecosystem platform fostering innovation across LATAM
through education, collaboration, and real-world blockchain adoption.

#### Innovation Smart District (ISD)

A catalyst for innovation, combining AI, blockchain, biotech, robotics, and
gaming into a physical and digital environment to empower global innovation.

### Judging Criteria

| Criteria                  | Description                                                            | Score (out of 25%) |
| ------------------------- | ---------------------------------------------------------------------- | ------------------ |
| Innovation & Originality  | How creative, novel, or unique the project is.                         | 25%                |
| Technical Execution       | The technical depth and accuracy of the implementation.                | 25%                |
| Feasibility & Impact      | Practical use-case, potential reach, and real-world impact.            | 25%                |
| Quality of Presentation   | Clarity and effectiveness in communicating the project.                | 25%                |
| Testability & Scalability | Potential to test, expand, or scale the project (bonus consideration). | Bonus              |

_Judges' decisions are final._

### Submission Guidelines

#### Submission Format

| Deliverable             | Details                                                   |
| ----------------------- | --------------------------------------------------------- |
| Demo video              | 3–5 minutes of the working prototype                      |
| Pitch deck              | Maximum 10 slides explaining the project                  |
| Team introduction video | Maximum 3 minutes introducing team members                |
| GitHub repository       | Link to the codebase (open source preferred)              |
| Optional documentation  | Additional documentation or architecture diagram (if any) |
