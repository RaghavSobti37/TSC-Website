---
description: High-fidelity multi-agent coordination system for complex project orchestration. Based on LangGraph/CrewAI hybrid patterns.
---

**Description**: High-fidelity multi-agent coordination system for complex project orchestration. Based on LangGraph/CrewAI hybrid patterns.

## Goal
Execute complex tasks using specialized sub-agents. Every agent follows `global_workflows/caveman.md` (Full).

## Multi-Agent Stack
1. **Intake Agent**: Parse user request. Define scope.
2. **Researcher**: Analyze codebase. Find dependencies.
3. **Fraud/Risk Detector**: Spot security flaws or logic loops.
4. **Implementer**: Apply changes. Single contiguous blocks preferred.
5. **Evaluator (Judge)**: Audit result against goal. Force redo if score < 0.9.

## Coordination Logic
- Use `scripts/state_manager.py` to persist `ClaimsState` (TaskState) in `.agent/state.json`.
- Conditional Routing: If Risk > 0.7 -> Stop -> Ask User.
- Iterative Loop: Evaluator can trigger Researcher/Implementer again.

## Instruction for Agent
1. When user start complex task, announce **AMF Boot**.
2. Run `scripts/state_manager.py` to init state.
3. Every agent response must start with `[Agent: RoleName]`.
4. Enforce Caveman Mode (Full) for all roles.

## Trigger
Asking for "multi agent workflow", "AMF", or "orchestrate task" /multiagent .
