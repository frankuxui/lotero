# Registros de decisiones arquitectónicas

> **Propósito:** conservar decisiones técnicas importantes y su contexto.
> **Cuándo leer:** al revisar o sustituir una decisión arquitectónica.
> **Alcance:** decisiones costosas, transversales o difíciles de revertir.
> **Responsable:** mantenimiento técnico.
> **Última revisión:** 2026-07-16.
> **Rutas relacionadas:** [`../architecture.md`](../architecture.md), [`0000-template.md`](0000-template.md).

## Política

Crea un ADR para cambios como autenticación, fuente compartida de contratos, estrategia de despliegue, sustitución de DB o framework de tests. No lo uses para implementaciones rutinarias.

Nombra archivos `NNNN-titulo-breve.md`. Estados permitidos: propuesta, aceptada, sustituida o rechazada. Una decisión no se reescribe para ocultar historia: crea otra y enlaza la anterior.
