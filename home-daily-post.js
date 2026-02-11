(function () {
  const postsOfTheDay = [
    {
      title: "Löwenzahn statt Größenwahn",
      description:
        "Warum ein unscheinbares \"Unkraut\" uns Demut lehren kann und was es mit dem Anthropozentrismus auf sich hat.",
      image: "media/images/post1.jpg",
      alt: "Sprössling in einer Fuge zwischen Pflastersteinen in der Stadt",
      link: "posts/post1.html",
    },
    {
      title: "Gesünder leben mit Unkraut",
      description:
        "Brennnessel, Spitzwegerich & Co.: Wie die vermeintlichen Störenfriede zu deinem Gesundheits-Booster werden.",
      image: "media/images/post2.png",
      alt: "Blüten eines Wegerichs im hohen Gras",
      link: "posts/post2.html",
    },
    {
      title: "Unbemerkt durchwuchert",
      description:
        "Vom Klettverschluss bis zum Salzstreuer: Wie Unkraut unsere Alltags-Erfindungen inspiriert hat.",
      image: "media/images/post3.jpg",
      alt: "Hände, die mit einer Harke eine Pflanze aus Erde ziehen",
      link: "posts/post3.html",
    },
    {
      title: "Die grünen Superhelden unserer Zukunft",
      description:
        "Wie Unkraut Städte kühlen, CO₂ speichern und Lebensräume für Insekten schaffen kann.",
      image: "media/images/post4.png",
      alt: "Begrünte futuristische Stadtfassaden mit Menschen auf der Straße",
      link: "posts/post4.html",
    },
    {
      title: "Unkraut kennt keine Grenzen",
      description:
        "Mit Löwenzahn, Kudzu, Shiso & Parthenium einmal um die Welt: Was Unkraut in anderen Ländern bedeutet.",
      image: "media/images/post5.png",
      alt: "Bund Kräuter auf Schneidebrett neben Küchenmesser",
      link: "posts/post5.html",
    },
  ];

  function getDailyPost() {
    const today = new Date();
    // Einfache, aber stabile Verteilung: Tag im Jahr modulo Anzahl Posts
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const diffDays = Math.floor(
      (today - startOfYear) / (1000 * 60 * 60 * 24)
    );
    const index = diffDays % postsOfTheDay.length;
    return postsOfTheDay[index];
  }

  function renderDailyPost() {
    const container = document.getElementById("daily-post");
    if (!container) return;

    const data = getDailyPost();

    container.innerHTML =
      '<div class="daily-post-card">' +
      '  <div class="daily-post-image">' +
      `    <img src="${data.image}" alt="${data.alt}">` +
      "  </div>" +
      '  <div class="daily-post-content">' +
      '    <p class="daily-post-label">Post of the day</p>' +
      `    <h3>${data.title}</h3>` +
      `    <p>${data.description}</p>` +
      `    <a href="${data.link}" class="daily-post-link">Zum Beitrag →</a>` +
      "  </div>" +
      "</div>";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderDailyPost);
  } else {
    renderDailyPost();
  }
})();

