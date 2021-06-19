<template>
  <section class="section">
    <div class="content">
      <h1>Labaux gestionnaire de portes</h1>
      <p>Intro</p>
      <h2>Comment ça marche ?</h2>
      <p>
        Le gestionnaire permet de gérer l'ouverture des portes de votre
        etablissement. Il comprend plusieur concepts:
      </p>
      <ul>
        <li><b>Les portes:</b> esp32 avec lecteur RFID et carte SD</li>
        <li><b>Les badges:</b> badges RFID associes a un utilisateurs</li>
        <li><b>Les horraires:</b> plages horraires.</li>
        <li>
          <b>Les groupes:</b> Lien entre des portes et des plages horraires.
          Definit pour chaque porte, quand elle peut etre ouverte par un
          utilisateur
        </li>
      </ul>
      <h3>Installation</h3>
      <p>Il y a deux etapes pour faire fonctionner le systeme:</p>
      <ul>
        <li><b>Installer le serveur</b></li>
        <li><b>Installer les portes</b></li>
      </ul>
      <h4>Installation du serveur</h4>
      <ul>
        <li>

      <a href="https://github.com/Leo-Nicolle/door-manager"
        >Telechargez le code</a
      >
      sur github.

      <p>
        <code>
          git clone https://github.com/Leo-Nicolle/door-manager
        </code>
      </p>

        </li>
        <li><b>Installer les portes</b></li>
      </ul>

      <h3>Configuration</h3>
      <p>....</p>
      <h3>Utilisation</h3>
      <p>....</p>
      <figure>
        <img src="https://bulma.io/images/placeholders/256x256.png" />
        <img src="https://bulma.io/images/placeholders/256x256.png" />
        <figcaption>Figure 1: Some beautiful placeholders</figcaption>
      </figure>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomePage",
};
</script>
