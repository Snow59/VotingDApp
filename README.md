# Application Décentralisée de Vote (VotingDApp)

**Groupe** :
- Hamza YAHIANI
- Ghassen BOUKRAIA
- Redouane HAMDOUD
- Ibrahim BOUBEKER
- André-Mathys FLINOIS

Cette application décentralisée permet aux utilisateurs de s'inscrire comme électeurs, de soumettre des propositions, de voter pour des propositions et de voir la proposition gagnante. L'application utilise les technologies blockchain pour assurer la transparence et la sécurité des votes.

## Table des Matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) et npm (ou yarn)
- [Metamask](https://metamask.io/) ou un autre portefeuille compatible avec Ethereum
- Hardhat

## Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone https://github.com/Snow59/VotingDApp.git
cd VotingDApp
npm install
```

## Configuration

### Contrat Intelligent

Lancez le node hardhat en allant dans le dossier backend, puis en exécutant :
```bash
npx hardhat node
```
Ensuite, déployez le contrat sur ce noeud. Toujours dans le dossier backend :
```bash
npx hardhat ignition deploy ./ignition/modules/deploy.ts --network localhost
```
Enfin, démarrez l'application (frontend), en exécutant dans le dossier frontend du repo :
```bash
npm run dev
```

Ouvrez votre navigateur et allez à `http://localhost:3000`.

### Fonctionnalités Principales

1. **Connexion du Portefeuille** : Connectez votre portefeuille Ethereum pour interagir avec l'application.
2. **Enregistrement des Électeurs** : Enregistrez une adresse d'électeur pour lui permettre de voter.
3. **Soumission des Propositions** : Soumettez une nouvelle proposition avec une description.
4. **Vote pour une Proposition** : Votez pour une proposition en fournissant son ID.
5. **Voir les Propositions** : Affichez une liste de toutes les propositions avec leurs descriptions et le nombre de votes.
6. **Voir les Votes** : Affichez une liste des votes pour chaque proposition.
7. **Calcul des Votes** : Tally les votes pour déterminer la proposition gagnante.
8. **Voir le Gagnant** : Affichez la proposition gagnante après le calcul des votes.
