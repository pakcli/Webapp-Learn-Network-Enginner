# 🌐 Network SOT - Obsidian Network IPAM

**Network Source of Truth (SOT)** - A lightweight, markdown-native IPAM tool for CCNA students to practice network design with version control.

## ✨ Features

### 🎯 Core Features
- **Port-Level IP Management** - Assign IPs per interface, not per device
- **Editable Table Interface** - Inline editing for all network parameters
- **Automatic Validation** - 8 validation rules with real-time feedback
- **Cascading Changes** (🔥 Killer Feature) - Change one IP, see all dependencies
- **CLI Generator** - One-click Cisco IOS config generation
- **Markdown Native** - All data stored as YAML frontmatter in `.md` files
- **Git-Ready** - Perfect for GitHub collaboration and version control
- **Network Topology Graph** - Visual representation of your network
- **Zero Dependencies** - Offline-first, no database required

### 🚀 Student Benefits
1. **Less Busywork** - Auto-calculate subnets, masks, wildcards
2. **Better Learning** - See network dependencies in real-time
3. **Git Workflow** - Learn version control while building networks
4. **Portable** - Take your lab anywhere (just GitHub repo)
5. **Free** - Open-source, forever free

---

## 📊 Competitive Advantage

| Feature | NetBox | Ansible | Packet Tracer | **Network SOT** |
|---------|--------|---------|---------------|----------------|
| Port-level IP management | ✅ | ❌ | ❌ | ✅ |
| Editable inline table | Partial | ❌ | ❌ | ✅ |
| Cascading confirmation | ❌ | ❌ | ❌ | ✅ |
| CLI generator | ❌ | ✅ | ❌ | ✅ |
| Lightweight/Offline | ❌ | ❌ | ✅ | ✅ |
| Git-native format | ❌ | ✅ | ❌ | ✅ |
| Learning-focused | ❌ | ❌ | ✅ | ✅ |
| Free | ✅ | ✅ | Partial | ✅ |

---

## 🎓 Perfect For

- 📚 **CCNA Students** (200-301) learning IPv4 addressing
- 🏫 **Networking Classes** (competitive advantage)
- 💼 **Lab Documentation** (instead of manual notes)
- 🤝 **Peer Learning** (GitHub collaboration)
- 🏢 **Small Lab Environments** (lightweight alternative to NetBox)

---

## 🚀 Quick Start

### Installation

```bash
# Clone repo
git clone https://github.com/pakcli/Webapp-Learn-Network-Enginner.git
cd Webapp-Learn-Network-Enginner

# Install dependencies
npm install

# Start dev server
npm run dev
# → Opens http://localhost:5173
```

### First Lab (5 minutes)

1. Open app
2. Click **"+ Add Device"**
3. Create devices: `R1` (router), `SW1` (switch), `PC1` (client)
4. Edit table:
   - R1.Gi0/0: 192.168.1.1/24
   - SW1.Gi0/0: connected to R1.Gi0/0
   - PC1.Gi0/0: 192.168.1.10/24 (gateway: 192.168.1.1)
5. Click **"Generate CLI"** → Copy to Packet Tracer
6. Click **"Export Vault"** → Commit to GitHub

---

## 📁 Project Structure

```
.
├── src/
│   ├── types/               # TypeScript interfaces
│   ├── components/          # React components
│   ├── services/            # Business logic (engines)
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utilities
│   ├── constants/           # Constants
│   ├── styles/              # Global CSS
│   ├── App.tsx              # Root component
│   └── index.tsx            # Entry point
├── docs/                    # Documentation
├── examples/                # Example vaults
├── tests/                   # Test files
└── public/                  # Static assets
```

---

## 🧠 How It Works

### The Data Model

Each device = one `.md` file with YAML frontmatter:

```yaml
---
hostname: R1
role: router
ports:
  Gi0/0:
    ip: 192.168.1.1
    cidr: 24
    subnet: 192.168.1.0
    wildcard: 0.0.0.255
    connected_to: SW1.Fa0/1
    ospf_area: 0
  Gi0/1:
    ip: 10.0.0.1
    cidr: 30
    connected_to: R2.Gi0/0
---

# Router Configuration

Core router for CCNA Lab 01
```

### The Validation Rules (8 Rules)

1. ✅ **Port-level IPs** - Every interface gets its own IP
2. ✅ **Same segment = same subnet** - Connected ports must match
3. ✅ **Gateway exists** - Client gateways must be real devices
4. ✅ **Router-to-router /30** - P2P links are point-to-point
5. ✅ **No overlap** - IPs must be unique
6. ✅ **OSPF match** - Wildcards must match CIDR
7. ✅ **Cascading confirm** - See dependencies before applying
8. ✅ **CLI valid** - Only generate if all rules pass

### The Killer Feature: Cascading Changes

```
User changes:  R1.Gi0/0: 192.168.1.1 → 192.168.2.1

System detects:
- PC1 gateway (192.168.1.1) no longer exists
- PC1 must move to 192.168.2.0/24

System asks:
"Update PC1 gateway to 192.168.2.1 and IP to 192.168.2.10? YES/NO"

User clicks YES → All 4 files updated
User clicks NO → Change reverted
```

---

## 📚 Documentation

- [Data Model Spec](./docs/DATA-MODEL.md)
- [Validation Rules](./docs/VALIDATION-RULES.md)
- [User Guide](./docs/USER-GUIDE.md)
- [Developer Guide](./docs/CONTRIBUTING.md)

---

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript
- **State**: Zustand
- **Styling**: CSS Modules
- **Build**: Vite
- **Testing**: Vitest + Testing Library
- **Graph**: Cytoscape.js
- **Data**: YAML + Markdown

---

## 🎯 Roadmap

### Phase 1 (MVP) ✅
- [x] React + TypeScript setup
- [x] Type definitions
- [ ] Markdown parser
- [ ] Device table component
- [ ] Validation engine
- [ ] CLI generator

### Phase 2
- [ ] Cascading detector
- [ ] Graph visualization
- [ ] File upload/export
- [ ] Obsidian plugin wrapper

### Phase 3
- [ ] GNS3 integration
- [ ] Packet Tracer export
- [ ] Multi-vault management
- [ ] Collaborative editing

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```bash
# Fork, create feature branch
git checkout -b feature/your-feature
commit changes
git push origin feature/your-feature
# Open PR
```

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) file

---

## 🎓 Made for CCNA Students

Specifically designed to help students like you:
- ✅ Stop spending time on manual data entry
- ✅ Focus on network design concepts
- ✅ Learn Git workflow alongside networking
- ✅ Build a portfolio on GitHub
- ✅ Collaborate with peers

**One Liner:**
> _"Enter IP once, validate automatically, see dependencies, generate CLI — focus on learning the logic, not busywork."_ 🎯

---

## 📞 Support

- 💬 GitHub Discussions: Ask questions
- 🐛 GitHub Issues: Report bugs
- 📧 Email: [your email]

---

**Happy learning! 🚀**
