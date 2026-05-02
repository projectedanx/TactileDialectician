with open("components/EpistemicEscrowDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace("queueMicrotask(() => setIsClient(true));", "setIsClient(true);")
content = content.replace("queueMicrotask(() => setScars(parsed));", "setScars(parsed);")
content = content.replace("const [isClient, setIsClient] = useState(false);", "const [isClient, setIsClient] = useState(false);\n  const [isMounted, setIsMounted] = useState(false);\n\n  useEffect(() => {\n    setIsMounted(true);\n  }, []);")

content = content.replace("  if (!isClient) {", "  if (!isMounted) {")


with open("components/EpistemicEscrowDashboard.tsx", "w") as f:
    f.write(content)
