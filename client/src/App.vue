<template>
  <div id="app">
    <div id="nav">
      <router-link to="/user">Utilisateurs</router-link>|
      <router-link to="/group">Groupes</router-link>|
      <router-link to="/schedule">Horraires</router-link>|
      <router-link to="/door">Portes</router-link>|
      <router-link to="/badge">Badges</router-link>|
      <router-link to="/login">login</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
