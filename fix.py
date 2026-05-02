with open("components/EpistemicEscrowDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace("        setScars(JSON.parse(loadedScars));", "        const parsed = JSON.parse(loadedScars);\n        queueMicrotask(() => setScars(parsed));")

with open("components/EpistemicEscrowDashboard.tsx", "w") as f:
    f.write(content)
