# Equi Protocol

Equi Protocol es una solución de pagos descentralizada que permite
transferencias instantáneas y seguras entre diferentes blockchains, con un
enfoque especial en la región LATAM.

## Características Principales

- **Descentralización Real**: Contratos inteligentes en blockchains públicas
  para manejar pagos y eventos
- **Compatibilidad con USDC**: Soporte inicial para USDC por su transparencia y
  cumplimiento regulatorio
- **Confirmación Instantánea**: Uso de BlockDAG para pagos casi en tiempo real
- **Arquitectura Event-Driven**: Emite eventos estructurados para integración
  con otros servicios
- **Preparado para Composición**: Diseñado para integrarse con otros protocolos
  DeFi
- **Soporte Multi-chain**: Inicia con BlockDAG y se expande a Celo, Base,
  Arbitrum y otros
- **Extensibilidad vía Plugins**: Sistema modular para integrar funcionalidades
  adicionales
- **Diseño Centrado en Developers**: Eventos estandarizados, código modular y
  testing con Foundry
- **Visualización en Tiempo Real**: Interfaz que muestra confirmaciones de pago
  inmediatamente
- **Open Source + Widgets**: Plantilla de frontend abierta para contribuciones
  de la comunidad
- **Enfoque en LATAM**: Solución para la fragmentación financiera en la región
- **Futuro con Stablecoins Locales**: Planes para integrar USDT y stablecoins
  nativas de Celo
- **Automatización Empresarial**: Los pagos activan flujos de trabajo
  automáticos
- **Interfaz POS + Facturación**: MVP incluye POS y plugin para factura
  electrónica

## Estructura del Proyecto

```
contracts/
├── src/
│   ├── core/
│   │   └── EquiCore.sol
│   ├── bridge/
│   │   └── EquiBridge.sol
│   ├── plugins/
│   │   ├── EquiPluginManager.sol
│   │   └── ElectronicInvoicePlugin.sol
│   ├── interfaces/
│   │   ├── IEquiCore.sol
│   │   ├── IEquiEvents.sol
│   │   └── IEquiPlugin.sol
│   └── EquiProtocol.sol
├── script/
│   └── Deploy.s.sol
├── test/
│   └── EquiProtocol.t.sol
└── foundry.toml
```

## Requisitos

- Solidity ^0.8.19
- Foundry
- Node.js >= 16
- pnpm

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/your-org/equi-protocol.git
cd equi-protocol
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Instalar Foundry:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

4. Compilar los contratos:

```bash
cd contracts
forge build
```

## Desarrollo

1. Crear un archivo `.env` con las variables necesarias:

```env
PRIVATE_KEY=your_private_key
BLOCKDAG_RPC_URL=your_blockdag_rpc_url
CELO_RPC_URL=your_celo_rpc_url
BASE_RPC_URL=your_base_rpc_url
ARBITRUM_RPC_URL=your_arbitrum_rpc_url
BLOCKDAG_API_KEY=your_blockdag_api_key
CELO_API_KEY=your_celo_api_key
BASE_API_KEY=your_base_api_key
ARBITRUM_API_KEY=your_arbitrum_api_key
```

2. Ejecutar tests:

```bash
forge test
```

3. Desplegar contratos:

```bash
forge script script/Deploy.s.sol --rpc-url $BLOCKDAG_RPC_URL --broadcast
```

## Documentación

La documentación completa está disponible en [docs/](./docs/).

## Contribuir

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo
[LICENSE](LICENSE) para más detalles.

## Contacto

- Website: [https://equi.protocol](https://equi.protocol)
- Twitter: [@EquiProtocol](https://twitter.com/EquiProtocol)
- Discord: [Equi Protocol](https://discord.gg/equi-protocol)
- Email: contact@equi.protocol
