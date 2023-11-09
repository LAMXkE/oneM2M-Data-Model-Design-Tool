<template>
    <div class="row">
      <!-- Navbar -->
      <nav class="component-navbar">
        <div class="col-8 title">
            <img src="../assets/logo.jpg" alt="Logo" style="width: 60px; margin-left: 30px; margin-top: 5px;">
            <p>
                oneM2M Data Model Design Tool
            </p>
        </div>
        <ul>
          <li><a href="https://github.com/LAMXkE/oneM2M-Data-Model-Design-Tool" target="_blank">Github</a></li>
          <li><a href="https://onem2m.org" target="_blank">about oneM2M</a></li>
          <!-- <li><a href="#">Contact</a></li> -->
        </ul>
      </nav>
      <!-- The rest of your component's content -->
    </div>
  </template>

  <style scoped>
  .component-navbar {
  background-color: #333; /* Set the background color for the navbar */
  padding: 10px; /* Add padding to provide spacing */
}

.component-navbar .title {
  color: #fff; /* White text color */
  font-size: 25px; /* Larger font size */
  font-weight: bold; /* Bold font weight */
    display: inline; /* Make the title appear inline */
}

.component-navbar .title p {
  margin-left: 10px; /* Remove the default top and bottom margins */
  padding-top: 10px;
  display: inline; /* Make the title appear inline */
}

.component-navbar ul {
  float: right; /* Float the list to the right */
  align-items: center; /* Center-align list items */
  list-style-type: none; /* Remove the bullet points for the list */
  display: inline-box;
  padding: 15px;
  margin: 0px;
}

.component-navbar li {
  display: inline; /* Display list items horizontally */
  text-align: center; /* Center-align list items */
  margin-left: 20px; /* Add space between list items */
  margin-right: 20px; /* Add space between list items */
}

.component-navbar a {
  text-decoration: none; /* Remove underlines from links */
  color: #fff; /* Set the text color to white */
  font-weight: bold; /* Make the text bold */
  font-size: 16px; /* Adjust the font size */
}

.component-navbar a:hover {
  text-decoration: underline; /* Add underline on hover */
}

  </style>
  