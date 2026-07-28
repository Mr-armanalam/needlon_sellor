# Architecture Principles IDs

```
AP-001 Business First
AP-002 Modularity
AP-003 Explicit Dependencies
AP-004 High Cohesion
AP-005 Low Coupling
AP-006 Simplicity
AP-007 Consistency
AP-008 Replaceability
AP-009 Testability
AP-010 Security by Design
```

# Constraint IDs

```
AC-001 Single Deployable Application
AC-002 Single Primary Relational Database
AC-003 Module Owns Its Data
AC-004 No Circular Dependencies
AC-005 Shared Contains No Business Logic
AC-006 Explicit Module Boundaries
AC-007 Business Logic Stays Inside Business Modules
AC-008 External Systems Are Replaceable

```

# Quality Attribute IDs

``` 
QA-001 Maintainability
QA-002 Scalability
QA-003 Security
QA-004 Reliability
QA-005 Testability
QA-006 Performance
QA-007 Developer Experience
QA-008 Flexibility
```

# Architecture Decisions Frozen
The following ADRs are now considered part of the system architecture.

| ADR     | Decision                                 | Status |
|---------|------------------------------------------|--------|
| ADR-001 | Modular Monolith                         | LOCKED |
| ADR-002 | C4 Architecture Documentation            | LOCKED |
| ADR-003 | Architecture Decision Records (ADR)      | LOCKED |
| ADR-004 | Architecture Governance                  | LOCKED |
| ADR-005 | PostgreSQL as Single Primary Database    | LOCKED |
| ADR-006 | Redis for Ephemeral Data & Rate Limiting | LOCKED |
| ADR-007 | Object Storage for Binary Assets         | LOCKED |
| ADR-008 | External Email Provider Strategy         | LOCKED |
| ADR-009 | External SMS Provider Strategy           | LOCKED |
| ADR-010 | External Payment Gateway Strategy        | LOCKED |
| ADR-011 | CDN Strategy                             | LOCKED |
