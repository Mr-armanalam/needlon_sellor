# Chapter 1 — Repository Organization

> Document Layer: Repository Foundation
>
> Depends On:
>
> - 00-PROJECT-CONSTITUTION.md
> - 01-PRODUCT-VISION.md
> - 02-ARCHITECTURE.md
> - 03-ENGINEERING-STANDARDS.md
>
> Purpose:
>
> Define the organizational philosophy of the Needlon repository and establish the rules that govern its overall structure.
>
> This chapter explains how the repository is organized, why it is organized that way, and the principles that must be followed as the project grows.

---

# 1.1 Purpose

The repository is more than a collection of files.

It represents the physical implementation of the Needlon platform.

A well-organized repository allows contributors to quickly locate files, understand project structure, reduce duplication, and scale development without creating confusion.

This chapter establishes the foundation for organizing every directory, module, configuration file, and asset within the repository.

---

# 1.2 Objectives

| ID | Objective |
|-----|-----------|
| FS-001 | Establish a predictable repository structure |
| FS-002 | Improve project navigation |
| FS-003 | Reduce misplaced files |
| FS-004 | Keep related code together |
| FS-005 | Minimize duplicate implementations |
| FS-006 | Support future scalability |
| FS-007 | Maintain long-term repository consistency |

---

# 1.3 Repository Philosophy

Needlon follows the following repository principles.

## Predictability

Every contributor should be able to predict where a file belongs without searching the repository.

If two engineers implement the same feature independently, both should naturally place files in the same location.

---

## Single Responsibility

Every directory should have one clearly defined responsibility.

Directories should not mix unrelated concerns.

Each folder exists for a specific purpose.

---

## Feature-Oriented Organization

Repository organization should prioritize business features rather than individual technologies whenever practical.

Files that contribute to the same feature should remain close together.

---

## Consistency

Similar files should always be organized in the same manner throughout the project.

Consistency is more valuable than personal preference.

---

## Scalability

Repository organization should continue to work as:

- new modules are added
- engineering teams grow
- project complexity increases
- documentation expands

Temporary structures should never become permanent architecture.

---

# 1.4 Repository Design Principles

The Needlon repository follows these design principles.

### Principle 1

A file should have one obvious location.

---

### Principle 2

Every directory must have a clearly defined purpose.

---

### Principle 3

Avoid creating new top-level directories unless absolutely necessary.

---

### Principle 4

Keep related files together.

Avoid scattering files belonging to the same feature across unrelated directories.

---

### Principle 5

Separate business features from shared project resources.

---

### Principle 6

Avoid duplicate implementations.

If similar files appear in multiple locations, repository organization should be reviewed.

---

### Principle 7

Repository organization should support discoverability before optimization.

Finding code quickly is more important than reducing folder depth.

---

# 1.5 Top-Level Repository Rules

The repository root should remain clean and intentional.

Only project-level resources belong at the root.

Examples include:

- application source
- project documentation
- configuration
- automation scripts
- public assets
- dependency manifests

Feature-specific implementation files must never be placed directly at the repository root.

---

# 1.6 Repository Growth Rules

As the project evolves:

- existing organization should be preserved whenever possible
- unnecessary restructuring should be avoided
- new directories should have a documented purpose
- duplicate folder hierarchies should not be introduced
- structural consistency should remain a priority

Repository growth should be evolutionary rather than disruptive.

---

# 1.7 Repository Ownership

Every file within the repository should have a clear ownership context.

Ownership may exist at different levels, including:

- project
- feature
- shared infrastructure
- documentation
- configuration

Files without an identifiable ownership context often become difficult to maintain.

---

# 1.8 Repository Maintenance

Repository quality should be maintained continuously.

Contributors should:

- remove obsolete files
- eliminate duplicate resources
- avoid abandoned directories
- keep configuration organized
- maintain documentation alongside implementation

Repository maintenance is an ongoing engineering responsibility.

---

# 1.9 Repository Success Criteria

Repository organization is considered successful when:

- contributors quickly locate implementation files
- directory responsibilities remain obvious
- duplicate structures are avoided
- new modules integrate naturally
- onboarding new contributors requires minimal explanation
- repository growth remains organized and predictable

---

# 1.10 Chapter Summary

This chapter establishes the organizational philosophy of the Needlon repository.

It defines the principles that guide repository structure, directory responsibilities, scalability, and long-term maintenance.

The following chapters build upon this foundation by defining the detailed folder hierarchy, module organization, shared resources, naming conventions, and repository governance rules.

# Chapter 2 — Application Structure

> Document Layer: Repository Structure
>
> Depends On:
>
> - Chapter 1 — Repository Organization
> - 02-ARCHITECTURE.md
> - 03-ENGINEERING-STANDARDS.md
>
> Purpose:
>
> Define the high-level organization of the Needlon application.
>
> This chapter establishes how the repository is divided into major areas and how application resources are grouped to maintain consistency, scalability, and maintainability.

---

# 2.1 Purpose

The Needlon repository is organized into logical areas that separate application code, shared resources, project documentation, configuration, automation, and static assets.

This organization ensures that contributors always know where new code belongs without relying on personal preference.

---

# 2.2 Objectives

| ID | Objective |
|-----|-----------|
| APP-001 | Organize the repository into logical sections |
| APP-002 | Separate application code from project resources |
| APP-003 | Keep feature development isolated |
| APP-004 | Simplify project navigation |
| APP-005 | Support future project growth |
| APP-006 | Maintain consistent repository organization |
| APP-007 | Reduce unnecessary structural complexity |

---

# 2.3 Application Organization Philosophy

The repository is organized around responsibility rather than technology.

The highest level of the repository separates:

- Application source
- Shared resources
- Configuration
- Documentation
- Static assets
- Development tooling
- Automation

Each area has a clearly defined responsibility.

---

# 2.4 Repository Layers

The Needlon repository is divided into the following logical layers.

```text
Repository

├── Application Layer
│
├── Shared Layer
│
├── Configuration Layer
│
├── Documentation Layer
│
├── Static Asset Layer
│
├── Development Layer
│
└── Automation Layer
```

Each layer represents a different responsibility within the project.

---

# 2.5 Application Layer

The Application Layer contains the actual business implementation of Needlon.

Responsibilities include:

- application routes
- business features
- user interfaces
- business workflows
- application services
- application state

Only production application code belongs in this layer.

---

# 2.6 Shared Layer

The Shared Layer contains reusable project resources.

Examples include:

- reusable UI
- shared utilities
- common constants
- reusable hooks
- shared libraries
- common types
- shared validation
- common helpers

Shared resources must remain independent of any single business feature.

---

# 2.7 Configuration Layer

The Configuration Layer centralizes project configuration.

Examples include:

- environment configuration
- application configuration
- feature configuration
- build configuration
- tooling configuration

Configuration should remain independent from business implementation.

---

# 2.8 Documentation Layer

The Documentation Layer contains every project document.

Examples include:

- Constitution
- Product Vision
- Architecture
- Engineering Standards
- Folder Structure
- Database Design
- UI Design System
- Roadmap
- Decision Log
- AI Documentation

Documentation should evolve together with the project.

---

# 2.9 Static Asset Layer

The Static Asset Layer contains project resources that are served directly without business logic.

Examples include:

- images
- icons
- illustrations
- fonts
- public media
- SEO resources

Static assets should remain organized according to their purpose.

---

# 2.10 Development Layer

The Development Layer supports local development.

Examples include:

- development utilities
- debugging resources
- local tooling
- testing resources
- mock data
- development scripts

Development resources must not become production dependencies unless intentionally promoted.

---

# 2.11 Automation Layer

The Automation Layer contains project automation.

Examples include:

- CI workflows
- deployment automation
- repository maintenance
- code generation
- release automation
- quality automation

Automation should reduce repetitive engineering work while maintaining project consistency.

---

# 2.12 Layer Boundaries

Each repository layer has a specific responsibility.

Contributors shall avoid mixing unrelated responsibilities across layers.

Examples:

- Documentation does not belong inside application modules.
- Static assets should not contain business logic.
- Configuration should not implement application behavior.
- Shared resources should not contain feature-specific code.
- Development utilities should not become production implementation.

Maintaining clear boundaries improves repository organization and long-term maintainability.

---

# 2.13 Repository Navigation Principles

A contributor should be able to answer the following questions quickly:

- Where does this new feature belong?
- Where should reusable code be placed?
- Where are project documents maintained?
- Where should configuration be added?
- Where do shared resources live?

If the answer is unclear, the repository organization should be reviewed.

---

# 2.14 Success Criteria

The application structure is successful when:

- repository navigation is intuitive
- contributors rarely question file placement
- related resources remain grouped together
- repository growth remains organized
- new features integrate without restructuring
- documentation, configuration, and implementation remain clearly separated

---

# 2.15 Chapter Summary

This chapter defines the high-level structure of the Needlon repository.

It separates the repository into logical layers based on responsibility rather than technology, creating a predictable and scalable foundation for the remainder of the folder structure.

The following chapters define the internal organization of modules, shared resources, naming conventions, and repository governance in greater detail.

# Chapter 3 — Module Folder Standards

> Document Layer: Feature Organization
>
> Depends On:
>
> - Chapter 1 — Repository Organization
> - Chapter 2 — Application Structure
> - 02-ARCHITECTURE.md
> - 03-ENGINEERING-STANDARDS.md
>
> Purpose:
>
> Define the standard internal organization of every feature module within the Needlon codebase.
>
> Every business module should follow the same structure to ensure consistency, maintainability, and scalability.

---

# 3.1 Purpose

Business modules are the building blocks of Needlon.

Regardless of the feature being implemented, every module should follow a consistent internal organization.

A predictable module structure improves discoverability, simplifies onboarding, reduces engineering mistakes, and allows contributors to move between features without learning different patterns.

---

# 3.2 Objectives

| ID | Objective |
|-----|-----------|
| MOD-001 | Standardize feature organization |
| MOD-002 | Keep business modules self-contained |
| MOD-003 | Reduce implementation inconsistencies |
| MOD-004 | Improve maintainability |
| MOD-005 | Encourage feature isolation |
| MOD-006 | Simplify future expansion |
| MOD-007 | Improve developer productivity |

---

# 3.3 Module Philosophy

Every Needlon module should follow these principles.

## Self-Contained

A module should contain everything required to implement its business capability.

Developers should rarely need to navigate unrelated modules while working on a feature.

---

## Single Business Responsibility

Each module represents one business capability.

Examples include:

- Seller
- Store
- Product
- Category
- Order
- Customer
- Subscription

A module should never represent multiple unrelated business domains.

---

## High Cohesion

Files that work together should remain together.

Avoid scattering module implementation throughout the repository.

---

## Low Coupling

Modules should communicate through approved interfaces.

Direct dependencies on another module's internal implementation should be avoided.

---

## Consistency

Every module should follow the same organizational pattern.

Contributors should immediately recognize how a module is structured.

---

# 3.4 Standard Module Blueprint

Every business module should be organized into clearly defined responsibilities.

A module may contain:

- User Interface
- Business Logic
- Data Access
- Validation
- Types
- Configuration
- Utilities
- Assets
- Tests
- Documentation

Only responsibilities required by the feature should be included.

Avoid creating empty directories simply to satisfy a template.

---

# 3.5 Required Module Responsibilities

Every module should clearly separate:

### User Interface

Responsible for presenting information and handling user interaction.

Must not contain business rules.

---

### Business Logic

Responsible for implementing business behaviour.

Must remain independent of presentation concerns.

---

### Data Access

Responsible for interacting with persistent data.

Must not contain business decisions.

---

### Validation

Responsible for validating external input.

Must not implement business workflows.

---

### Shared Types

Defines contracts used internally by the module.

Types should remain scoped to the module unless genuinely reusable.

---

# 3.6 Optional Module Responsibilities

Depending on business requirements, a module may include:

- Background processing
- Notifications
- File management
- Search
- Import / Export
- Reporting
- Analytics
- Feature-specific utilities
- Feature configuration

Only include responsibilities that the module actually requires.

---

# 3.7 Module Boundaries

A module owns its own business rules.

Other modules should not directly modify another module's internal implementation.

Communication between modules should occur through approved public interfaces.

Internal implementation details should remain private.

---

# 3.8 Shared Resource Rules

Not every reusable file belongs in a shared location.

Move code to shared resources only when:

- it is used by multiple modules
- it is independent of business context
- it can be maintained without feature-specific knowledge

Premature sharing often creates unnecessary coupling.

---

# 3.9 Internal Organization Principles

Within a module:

- similar files should remain together
- responsibilities should remain clearly separated
- related resources should be easy to locate
- unnecessary nesting should be avoided
- organization should remain predictable

Contributors should be able to navigate any module without additional documentation.

---

# 3.10 Module Evolution

Modules will grow over time.

Growth should be managed by:

- preserving responsibility boundaries
- avoiding duplication
- extracting reusable functionality only when justified
- documenting significant structural changes

Module evolution should improve clarity rather than increase complexity.

---

# 3.11 Module Checklist

Before introducing a new module, verify:

- it represents one business capability
- responsibilities are clearly separated
- no existing module already owns the functionality
- shared resources are used appropriately
- implementation follows engineering standards
- organization matches existing modules

Consistency across modules is more valuable than creating custom structures.

---

# 3.12 Success Criteria

Module organization is successful when:

- contributors can navigate any module quickly
- business responsibilities remain clear
- implementation is easy to extend
- duplicate structures are minimized
- new modules follow established patterns
- module maintenance remains predictable

---

# 3.13 Chapter Summary

This chapter establishes the standard blueprint for every Needlon business module.

By defining consistent responsibilities, boundaries, and organizational principles, every feature follows the same internal structure, reducing complexity and improving long-term maintainability across the project.

# Chapter 4 — Shared Resources

> Document Layer: Shared Repository Resources
>
> Depends On:
>
> - Chapter 1 — Repository Organization
> - Chapter 2 — Application Structure
> - Chapter 3 — Module Folder Standards
> - 03-ENGINEERING-STANDARDS.md
>
> Purpose:
>
> Define how reusable resources are organized within the Needlon repository and establish the rules for when functionality should remain inside a business module or become part of the project's shared resources.
>
> The objective is to maximize reuse without sacrificing module independence.

---

# 4.1 Purpose

Not every reusable piece of code belongs in a shared location.

Prematurely moving code into shared directories often creates unnecessary dependencies, reduces module independence, and increases maintenance complexity.

This chapter defines what qualifies as a shared resource and establishes the rules for organizing shared functionality across the Needlon project.

---

# 4.2 Objectives

| ID | Objective |
|-----|-----------|
| SHR-001 | Standardize shared resources |
| SHR-002 | Reduce duplicate implementations |
| SHR-003 | Preserve module independence |
| SHR-004 | Prevent unnecessary abstractions |
| SHR-005 | Improve repository consistency |
| SHR-006 | Encourage intentional reuse |
| SHR-007 | Simplify long-term maintenance |

---

# 4.3 Shared Resource Philosophy

Shared resources exist to support multiple business modules.

A resource should become shared only when it provides value across the project without introducing unnecessary coupling.

Sharing code simply because it appears similar is discouraged.

The cost of maintaining shared code should always be lower than maintaining separate implementations.

---

# 4.4 What Qualifies as Shared

A resource may become shared when:

- it is used by multiple business modules
- it has no dependency on a specific business domain
- it can evolve independently
- it has a stable responsibility
- it improves consistency across the project

Shared resources should solve common problems rather than feature-specific ones.

---

# 4.5 What Must Remain Inside a Module

The following should remain within their owning module:

- business rules
- feature workflows
- business validation
- feature-specific configuration
- module-specific utilities
- feature assets
- business terminology unique to the module

Business ownership should remain obvious.

---

# 4.6 Categories of Shared Resources

Shared resources generally fall into the following categories:

### Shared User Interface

Reusable interface elements that maintain a consistent user experience across the platform.

---

### Shared Utilities

General-purpose helper functions that are independent of any business feature.

---

### Shared Types

Common contracts used by multiple modules.

Business-specific types should remain within their owning module.

---

### Shared Constants

Application-wide values that require consistency across multiple features.

Business values belonging to one module should not become global constants.

---

### Shared Configuration

Configuration used across multiple parts of the application.

Feature-specific configuration remains inside the owning feature.

---

### Shared Assets

Reusable project assets such as icons, illustrations, fonts, and branding resources.

Feature assets should remain local to the feature whenever practical.

---

### Shared Infrastructure

Resources that support the entire application rather than one business capability.

These resources should remain independent of business logic.

---

# 4.7 Reuse Guidelines

Before introducing a shared resource, contributors should ask:

- Is this actually reused?
- Does it depend on one business module?
- Will making it shared simplify maintenance?
- Does sharing increase coupling?
- Can the resource evolve independently?

If the answer is uncertain, keep the implementation within its owning module.

---

# 4.8 Shared Resource Boundaries

Shared resources must never:

- implement business workflows
- own business decisions
- depend on feature-specific implementation
- introduce circular dependencies
- become a dumping ground for miscellaneous code

Every shared resource should have a clearly defined responsibility.

---

# 4.9 Growth Rules

As the project grows:

- shared resources should remain organized by responsibility
- duplicate utilities should be consolidated
- obsolete shared resources should be removed
- feature-specific code should not migrate into shared locations without justification

Repository growth should improve clarity rather than increase abstraction.

---

# 4.10 Shared Resource Checklist

Before creating a shared resource, verify:

- it is genuinely reusable
- multiple modules require it
- it has no feature ownership
- responsibilities remain clear
- documentation is updated if necessary
- the resource follows existing project conventions

Avoid creating shared code "just in case."

---

# 4.11 Success Criteria

Shared resources are successful when:

- duplicate implementations are minimized
- business modules remain independent
- contributors understand where reusable code belongs
- shared resources remain cohesive
- maintenance effort decreases over time
- repository organization remains predictable

---

# 4.12 Chapter Summary

This chapter establishes the standards for organizing shared resources within the Needlon repository.

By clearly defining what belongs in shared locations and what should remain inside business modules, the project maintains a balance between reuse and module independence, supporting a scalable and maintainable repository structure.

# Chapter 5 — Naming & Repository Maintenance

> Document Layer: Repository Consistency
>
> Depends On:
>
> - Chapter 1 — Repository Organization
> - Chapter 2 — Application Structure
> - Chapter 3 — Module Folder Standards
> - Chapter 4 — Shared Resources
> - 03-ENGINEERING-STANDARDS.md
>
> Purpose:
>
> Define repository-wide naming conventions, structural consistency rules, repository evolution guidelines, and maintenance practices that ensure the Needlon codebase remains organized throughout its lifecycle.
>
> This chapter governs **how the repository evolves**, not how business features are implemented.

---

# 5.1 Purpose

A repository is never finished.

Every new feature introduces new files, directories, assets, configurations, and documentation.

Without consistent naming and maintenance rules, repository quality gradually degrades.

This chapter establishes long-term standards for keeping the Needlon repository clean, predictable, and scalable.

---

# 5.2 Objectives

| ID | Objective |
|-----|-----------|
| REP-001 | Maintain repository consistency |
| REP-002 | Standardize naming conventions |
| REP-003 | Prevent unnecessary directory growth |
| REP-004 | Keep repository easy to navigate |
| REP-005 | Simplify long-term maintenance |
| REP-006 | Reduce structural duplication |
| REP-007 | Preserve repository quality over time |

---

# 5.3 Naming Philosophy

Names should communicate purpose immediately.

Every contributor should understand the responsibility of a file or directory without opening it.

Repository naming should prioritize:

- clarity
- consistency
- predictability
- business terminology
- readability

Personal naming preferences must never override project conventions.

---

# 5.4 Folder Naming Standards

Folder names should:

- describe a single responsibility
- remain concise
- use project-approved terminology
- avoid abbreviations unless officially adopted
- remain consistent across the repository

Folder names should describe **what the directory contains**, not **how it is implemented**.

---

# 5.5 File Naming Standards

File names should clearly represent their purpose.

Files with similar responsibilities should follow the same naming pattern throughout the project.

Avoid:

- ambiguous names
- temporary filenames
- version suffixes
- unnecessary prefixes
- generic names that hide intent

A contributor should understand the purpose of a file from its name alone.

---

# 5.6 Repository Evolution Rules

Repository growth should be intentional.

Before introducing a new directory, contributors should verify:

- an appropriate location does not already exist
- the directory has a unique responsibility
- it will not duplicate existing organization
- it supports long-term maintainability

Repository expansion should preserve consistency rather than increase complexity.

---

# 5.7 Directory Lifecycle

Directories evolve over time.

Each directory should have a lifecycle:

Creation

↓

Active Development

↓

Maintenance

↓

Deprecation (if required)

↓

Removal or Archive

Unused directories should not remain indefinitely.

---

# 5.8 Repository Maintenance Standards

Repository maintenance is an ongoing engineering activity.

Contributors should regularly:

- remove obsolete files
- eliminate duplicate resources
- delete unused assets
- archive deprecated content
- reorganize only when justified
- maintain documentation alongside implementation

Maintenance should occur continuously rather than as a separate cleanup phase.

---

# 5.9 Structural Consistency Rules

To preserve repository quality:

- similar modules should follow the same structure
- identical responsibilities should have identical organization
- shared resources should remain centralized
- feature-specific resources should remain inside their owning feature
- documentation should stay synchronized with implementation

Consistency is more important than optimizing individual features.

---

# 5.10 Repository Anti-Patterns

The following practices should be avoided:

- creating directories without a defined purpose
- duplicate folder hierarchies
- deeply nested structures without justification
- storing unrelated resources together
- leaving deprecated files in active locations
- creating "miscellaneous" or catch-all directories
- moving feature-specific code into shared locations without justification

These patterns reduce discoverability and increase maintenance effort.

---

# 5.11 Repository Review Checklist

When reviewing structural changes, verify:

- naming follows project conventions
- no duplicate directories were introduced
- responsibilities remain clear
- shared resources are used appropriately
- feature ownership is preserved
- documentation reflects structural changes
- repository organization remains consistent

Repository organization should improve with every contribution.

---

# 5.12 Success Criteria

Repository organization is successful when:

- contributors immediately know where new files belong
- naming remains consistent across the project
- duplicate structures are avoided
- repository navigation remains intuitive
- project growth does not increase organizational complexity
- long-term maintenance remains manageable

---

# 5.13 Chapter Summary

This chapter establishes the standards for naming, maintaining, and evolving the Needlon repository.

By enforcing consistent naming conventions, controlled repository growth, and continuous maintenance, the project preserves a clean and scalable structure that remains easy to understand as Needlon evolves.

---

# 5.14 Document Completion Statement

`04-FOLDER-STRUCTURE.md` defines the physical organization of the Needlon repository.

Together, its five chapters establish:

- Repository Organization
- Application Structure
- Module Folder Standards
- Shared Resources
- Naming & Repository Maintenance

This document serves as the authoritative reference for repository organization, ensuring that every directory, module, shared resource, and file is placed consistently and maintained according to approved project standards.

It complements the Architecture and Engineering Standards documents by defining **where implementation belongs**, enabling contributors and AI assistants to navigate and extend the Needlon codebase confidently without introducing structural inconsistency.