here is a project i'm working on using the principles of clean architecture. 
The front is vuejs. There is not actual backend but i build it like there could be one later on. 
Same with the db that is juste a json.
What is good, what could be better ? obvisouly ignore the TODO for the parts not implemented yet. 
i guess my main concern may be that i overengineered it ?
Also not sure if the storeService on frontEnd should use the api to fetch the updated data or should the fetch be outside and be done manually and the store receive the new value (QuestStoreService etc)
....

TODO

faire que on puisse choisir la difficulté de la quete et que rewards et goal s'affiche

Mettre en place des mocks +
une structure pour tester unitairement avec injection de dépendance chaque layer.

-------




















Changement d'orientation voulu, moins RPG plus production+RTS.

🌍 Contexte :
Le joueur incarne le MC (amnésique) intégré dans une campagne de colonisation d’un royaume humain.
On est dans un ton "Frontier magique", une Conquête de l’Ouest mystique, avec une ambiance d’expansion contrôlée par la couronne.
Le royaume “ouvre” des zones à coloniser, mais :

peu de financement,

les colons doivent “se débrouiller”,

et les ressources avancées (éther, artefacts) restent monopolisées par la capitale.

🎮 Gameplay de départ :
City-builder light façon Banished / Farthest Frontier → tu apprends à :

nourrir ta colonie,

bâtir, recruter, explorer,

suivre des “contrats royaux” (missions/explorations → ressources rares).

🎭 Diégèse :
Le joueur croit qu’il va “développer colonie après colonie” (pattern moderne “île par île”),
mais en réalité, c’est un seul monde interconnecté, qui va s’ouvrir d’un coup après le twist du portail.

🔄 Twist :
Quand tu atteins le T1 → T2, tu dois construire un portail pour valider ton statut de “Colonie Royale” (comme un check administratif / rituel magique).
Sauf que… ce portail crée une faille réelle.
=> Incursion Helloxienne.
=> Destruction du village tutoriel.
=> Éveil du MC.
=> Révélation partielle du vrai monde.

🎬 Fin de l’acte 1 :
Tout ce que tu as bâti (ta petite ville, tes colons, tes amis) est détruit.
C’est une cassure ludique et émotionnelle forte, qui sert à basculer dans le vrai gameplay du jeu.

Avantage : c'est que le système combat actuel hybride se porte bien a cette modification. On peut changer des sorts en ordres tactiques etc.

Concept de base : on conerve l'idée de recruter des personnages avec leur rareté et leurs skills passif/actif.
Sauf que on les vois comme des commandants a affecter a des unités d'armée.

L'idée c'est que faut construire son empire en commancant par produire fer/or/argent/nourriture etc.
Pas de recherche, juste les unités plus rare sont naturellement bloqué car demande des ressources plus compllexes.

Chaque unité a de l'upkeep, que se soit mana/essence pour vehicule, nourriture pour humain, munition pour artillerie/fantassin, etc
idealement si on peut integrer un systeme de logistique se serait encore mieux.

Avoir des unites qui juste permette au groupe d'avoir plus d'essence donc poursuivre plus loins avant de devoir faire une pause etc.
Pas de resource partagé juste des unites dediee qui agissent comme des entrepots mobiles + partage automatique autour de ville/outpoust construit par joueur.

idealement avoir peut etre un systeme de reputation avec autres factions qui ont leur alignement et objectifs (genre slaver/drug addict/nature_lover etc).

faire que armée fonctionne sans les "personnage recruté" sauf que se soit comme un
Idem les troupes requiert une population disponible, certains vehicule requiert un type de troupe particuler qu'il faut eduquer avant
(avions -> cartographe -> humain ayant fait lycée) / (dragon -> pilote -> ecole dédié) 
Dragon peut etre soigner uniquement dans véto ou unité mobile qui en requirement demande d'avoir ecole veto etc.
Idem pour vehicule et mana, certain plus fort demande mana rafinée, alors que les moins cher demande mana crude...

Voir pour integrer aisement contenu 18+ dans le systeme. Genre Pour grimper la population, pour calmer les soldats, etc



--------

Structure globale du tutoriel narratif (version longue, ~10 min / 1 an ingame)


V1


Objectif : enseigner les mécaniques de base (construction, ressources, gestion du temps, décisions), tout en racontant une année entière de colonisation à travers des ellipses bien placées, et un arc dramatique clair.

🕯️ Phase 1 – Le Réveil & la Mission du Feu (Jour 1)

🎬 Scène d’intro textuelle (style FTL)

« Tu ouvres les yeux. Une lumière chaude. Des visages.
Une voix grave : “Il respire encore…? Bon, qu’il se repose. On part à l’aube.” »

“Le lendemain, tu marches avec eux. Des pionniers. Un convoi envoyé par le royaume, chargé d’établir un avant-poste dans cette terre vierge.

Ils t’ont trouvé au bord de la route, sans mémoire. Mais ici, chaque bras compte.”

[Ton nom ?] [Tes origines ?] [Ton talent latent ?]

🧭 (Création de personnage – donne les traits / bonus initiaux)

🎮 Objectif gameplay :

Interface simplifiée (seulement 2-3 slots de construction).

Le capitaine dit :

“On va monter le camp ici.
Occupe-toi du feu et du puits, le reste s’occupe de dresser les tentes.”

🏗️ Le joueur construit 🔥 feu de camp + 💧 puits.

📜 Texte parallèle :

“Pendant que tu installes le foyer, les autres montent les tentes.
On dirait qu’ils savent ce qu’ils font. Et toi aussi, étrangement.”

🧱 Fin de phase → validation :

“Bien. On tiendra la nuit.
Demain, on fera mieux.”

🌾 Phase 2 – L’Installation (Semaine 1 → Mois 1)

⚙️ Nouveau panneau : construction de base (bûcheron, abri, stockage)

“Le comité se réunit.
— Toi, t’as la tête sur les épaules. Tu géreras le chantier du bûcheron.
Nous, on va étendre les champs.
T’inquiète, on te laissera pas tout faire seul.”

🎮 Gameplay :

Construire 1 bâtiment clé (poste de bûcheron / entrepôt)

En parallèle → message :

“Le capitaine et les siens installent un atelier rudimentaire.”

Une fois fini → nouveau bâtiment auto-construit (forgeron ou champs) avec justification :

“On a monté une forge temporaire. Faudra penser à l’agrandir un jour.”

🎬 Ellipses temporelles :

Après chaque mission, un petit encart narratif du style :

“Deux semaines plus tard…”
“L’hiver approche. Le bois sèche, les champs dorent.”

📈 → Ça crée un rythme naturel, sans que le joueur se sente pressé.

🪓 Phase 3 – L’Autonomie (Mois 2 → Mois 6)

“On commence à s’en sortir, gamin.
Tu deviens nos mains.
Alors on va t’apprendre à penser comme nous.”

🎮 Nouvelles mécaniques :

Gestion des ressources : bois / pierre / nourriture

Petites décisions :

“On a repéré des ruines dans la vallée.
On explore maintenant ou on finit les palissades ?”

💬 Choix = micro-événements textuels (style FTL) :

Explorer = gain de savoir (codex / lore fragment)

Palissades = gain de défense

🧭 Toujours en mode “le comité décide, toi tu exécutes”,
mais parfois ils demandent ton avis :

“T’en penses quoi ?”

Petit à petit, tu influences leurs ordres.
C’est ton premier pas vers le rôle de leader.

🛡️ Phase 4 – La Menace & L’Attaque (Mois 8 → 12)

“Une nuit, les éclaireurs reviennent en panique :
— Des gobelins ! Par dizaines ! Ils ont suivi nos traces !”

🎮 Gameplay :

Mission “Défense du camp” (construction urgente)

Le joueur place palissades, guet, feu, etc.

En parallèle, texte :

“Le capitaine rassemble les miliciens.
Le forgeron chauffe ses lames.
Toi, tu bâtis. Encore.”

🧨 Événement final :

Attaque scriptée.

Perte d’unités / bâtiments.

Le capitaine est grièvement blessé.

“On a tenu… mais à quel prix.
Le vieux capitaine… il respire à peine.
Il murmure ton nom.
— … à toi de jouer, maintenant. Continue. Fais en sorte que ce camp… vive.”

💀 Mort du chef → transfert symbolique du pouvoir.
🎬 Transition vers “Jeu complet” :

“Un an s’est écoulé. Tu n’es plus l’étranger.
Tu es le bâtisseur. Le guide.
Ce camp est ton œuvre, désormais.”

🎮 Interface complète débloquée.
Fin du tutoriel → jeu libre (gestion totale, expansion, quête principale).



V2


Phase 1 — Le Convoi & le Réveil (Mois 0-1)
🎬 Contexte

Le convoi du capitaine est déjà diminué quand il découvre le MC (ambuscades, maladies, route difficile).

Il rejoint un deuxième groupe, dirigé par un chef plus jeune et plus fougueux, venu d’une autre colonie, contraint à fuir.

Ce regroupement fragile sert de base au futur camp.

⚙️ Gameplay

Construction de base : feu de camp, puits, abris, entrepôt.

Introduction des ressources primaires (bois, eau, vivres).

Actions parallèles : “Pendant que tu montes le camp, l’autre groupe installe des tentes à l’écart.”

🎭 Événements

Divergences immédiates entre les deux leaders :

“Faut-il se fixer ici ou avancer plus loin ?”

Décision : on reste → la colonie est fondée.

💔 Impact

Le MC est vu comme l’arbitre neutre, car extérieur aux querelles.

Il agit sans décider, mais gagne confiance et visibilité.

🧭 Rôle du MC : exécutant fiable.

Phase 2 — L’Installation & la Fracture (Mois 2-3)
🎬 Contexte

Les tensions entre les deux groupes augmentent :

Les ressources sont insuffisantes,

Les vivres diminuent,

L’hiver approche trop vite.

⚙️ Gameplay

Missions :

Construire un camp de bûcherons / un fumoir / une zone agricole rudimentaire.

Décision : “Répartir les vivres équitablement ou privilégier les travailleurs ?”

🎭 Événements

Dispute majeure : une femme malade (ou un enfant blessé) ralentit tout le monde.

Certains veulent l’abandonner, d’autres refusent.
Le capitaine tranche : “On ne laisse personne derrière.”
L’autre chef quitte le camp avec ses partisans (~⅓ du groupe, dont les plus forts).

💔 Impact

Le camp est affaibli, amputé de ses meilleurs bras.

Le capitaine garde la morale, mais perd la force de travail.

Le MC prend naturellement plus de tâches techniques et logistiques.

🧭 Rôle du MC : bras droit improvisé (compétent, jeune, endurant).

Phase 3 — La Survie & l’Épreuve (Mois 4-6)
🎬 Contexte

Le camp lutte contre le manque de main-d’œuvre.

Les femmes, enfants, et blessés deviennent la majorité.

Le capitaine, vieux et usé, ne peut plus superviser chaque tâche.

⚙️ Gameplay

Construction : grange, four, atelier, palissade partielle.

Introduction de la gestion du moral et des tâches assignées.

Événement : exploration de ruines à proximité → découverte de fragments d’artefacts (codex Helloxien).

🎭 Événements

Maladie : fièvre d’eau stagnante → plusieurs morts.

MC propose un plan d’assainissement (premier vrai choix stratégique).

Réussi → respect accru.
Échec → perte, mais image de “celui qui agit”.

💔 Impact

Le MC devient celui qu’on écoute quand il parle.

Le capitaine lui confie davantage de responsabilités :

“Je peux plus grimper les collines, c’est toi qui verras les alentours.”

🧭 Rôle du MC : gestionnaire de terrain / stratège local.

Phase 4 — L’Été du Feu & les Rivalités (Mois 7-8)
🎬 Contexte

Un autre groupe de colons (anciens compagnons du groupe dissident) passe à proximité.

Ils sont mieux armés, plus nombreux, mais fermés :

“Leur chef ne veut pas partager ses terres.”

Petite querelle territoriale ou troc tendu.

⚙️ Gameplay

Décision : marchander / coopérer / ignorer.

En parallèle : amélioration des défenses, champs étendus, stockage d’eau.

🎭 Événements

Attaque mineure nocturne (gobelins opportunistes ou pillards).

Plusieurs blessés, le capitaine touché.

💬 “T’as réagi vite, gamin. Sans toi, on y passait tous.”

💔 Impact

Le MC dirige la défense spontanément (première mission “combat/urgence”).

Le capitaine commence à décliner physiquement.

Une partie des colons (ceux du 2e groupe restant) commencent à voir le MC comme chef officieux.

🧭 Rôle du MC : commandant en herbe.

Phase 5 — L’Hiver des Cendres (Mois 9-11)
🎬 Contexte

Le froid, la faim, la fatigue.

Plusieurs décès (vieillards, malades).

Les tensions internes s’effacent au profit d’un instinct de survie.

⚙️ Gameplay

Missions longues : chasse, stockage, réparation, gestion de crises.

Ellipses temporelles claires :

“Trois semaines de neige. Pas un cri, pas un feu. Juste la faim.”

🎭 Événements

Le MC organise les rations, les tours de garde, la gestion du feu.

Le capitaine, alité, le conseille :

“Tu fais déjà mon travail. Je ne suis plus que le souvenir d’un ordre.”

💔 Impact

Le MC devient le visage de la survie du camp.

À chaque décision, les survivants le regardent.

“On fait comme il dit.”

🧭 Rôle du MC : chef de facto.

Phase 6 — Le Printemps Sanglant (Mois 12)
🎬 Contexte

Le camp se relève, lentement.

Le capitaine, diminué, demande à activer un portail de communication (liens avec le royaume).

Pendant sa mise en route → rupture dimensionnelle, attaque de gobelins, ou incident magique (préfigurant le conflit).

⚙️ Gameplay

Défense ultime, gestion d’urgence.

Pertes massives, incendies, destruction partielle du camp.

🎭 Événements

Le capitaine meurt en te confiant la responsabilité :

“Fais tenir le feu… peu importe le monde autour.”

Certains colons veulent fuir, d’autres reconstruire.

Tous finissent par se tourner vers le MC.

💬 “Il est encore debout, lui. Alors on reste.”

🧭 Rôle du MC : leader reconnu, chef légitime, survivant élu par le feu.

V3

🗓️ Timeline tutoriel – 12 mois
Mois 1 – Le Réveil

Texte : “Tu ouvres les yeux près du feu. Des visages inconnus te regardent. Le convoi a survécu aux routes difficiles et aux embuscades. On te garde pour tes bras et tes yeux, malgré ton passé inconnu.”

Mission : Construire feu de camp + puits + abris simples.

Événement : Coordination avec un autre groupe de colons ; discussion sur où s’installer.

Gain : MC exécutant fiable, visible par tous.

Mois 2 – La Fracture

Texte : “Le bois diminue, l’hiver approche. La cohabitation devient tendue.”

Mission : Bâtir un bûcheron + stockage.

Événement : Débat moral : une femme malade ralentit le groupe. Le second chef part avec ses partisans.

Gain : MC devient bras droit, commence à gérer plus de tâches.

Mois 3 – Premiers défis

Texte : “Le camp est affaibli, les vivres comptés. Chaque geste compte.”

Mission : Aménager un champ + palissade partielle.

Événement : Petite expédition pour récolter vivres et bois, découverte d’un artefact mineur (codex fragment).

Gain : MC gagne confiance des colons, commence à être écouté.

Mois 4 – Maladies et discipline

Texte : “Une fièvre s’installe. Les morts s’accumulent.”

Mission : Mettre en place rations, nettoyage, surveillance des malades.

Événement : Premier vrai choix stratégique : plan d’assainissement du camp.

Gain : MC perçu comme gestionnaire compétent.

Mois 5 – Les travaux d’été

Texte : “Le printemps apporte l’espoir. Les champs verdissent, mais la fatigue persiste.”

Mission : Améliorer les structures (grange, fumoir, atelier).

Événement : Rupture de morale mineure : colons discutent de quitter le camp pour une autre vallée.

Gain : MC influence certaines décisions.

Mois 6 – Premières explorations

Texte : “Les collines autour semblent prometteuses mais dangereuses.”

Mission : Exploration des ruines voisines, récupération de fragments d’artefacts.

Événement : Une tempête détruit partiellement un bâtiment.

Gain : MC coordonne reconstruction et exploration → respect et autorité accrue.

Mois 7 – La Menace

Texte : “Un groupe de colons rivaux approche, armé et méfiant.”

Mission : Défense, renforcement des palissades, assignation de postes.

Événement : Première attaque mineure (gobelins / pillards).

Gain : MC dirige la défense → premier instinct de chef.

Mois 8 – L’été du feu

Texte : “Le capitaine commence à montrer des signes de fatigue. Les regards se tournent vers toi.”

Mission : Construction d’un garde-feu + améliorations défensives.

Événement : Second conflit avec groupe voisin, négociation ou affrontement.

Gain : MC reconnu comme stratège local.

Mois 9 – Hiver précoce

Texte : “La neige arrive tôt. Le froid immobilise une partie du camp.”

Mission : Gestion rations, tours de garde, chauffage.

Événement : Décès de plusieurs colons, morale en baisse.

Gain : MC assume presque toutes les décisions quotidiennes.

Mois 10 – Survie

Texte : “Chaque jour est un test. La survie prime.”

Mission : Chasse prolongée, stockage, réparation des abris.

Événement : Épidémie de grippe / intoxication → besoin de trancher dans les effectifs ou improviser soins.

Gain : MC devient leader de facto, le groupe lui fait confiance.

Mois 11 – Le printemps approche

Texte : “L’hiver s’achève, mais le camp est réduit et affaibli. L’autorité du capitaine décline.”

Mission : Planification de la reconstruction + préparation d’un portail ou balise de communication.

Événement : Les colons restants acceptent les décisions du MC sans contestation.

Gain : MC légitimé, prêt à assumer le rôle de chef officiel.

Mois 12 – L’attaque finale

Texte : “Alors que le camp s’organise, une faille / incursion / attaque majeure frappe.”

Mission : Défense d’urgence, reconstruction partielle.

Événement : Le capitaine meurt / blessé gravement → transfert symbolique du pouvoir.

Gain : MC devient officiellement chef de la colonie, maître de toutes les actions.

💡 Notes pour gameplay :

Chaque mois = 1-2 missions jouables + texte narratif + ellipse (ellipses justifient le passage du temps).

Actions du reste du village peuvent se produire en parallèle (auto-construction, défense, etc.), pour montrer que le MC agit dans un contexte vivant.

Progression de l’autorité = naturelle et graduelle, renforcée par événements, pertes et responsabilités.

L’ellipse temporelle permet de compress­er l’année de tutoriel en ~10-15 min de jeu.


