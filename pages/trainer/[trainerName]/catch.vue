<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = ref("");
const isDisplay = ref(false); // 読み込み中はポケモンリストを表示しない
const limit = ref(30);
// const offset = computed(() => page.value * limit.value);
const { data: pokemons, refresh } = await useFetch(
  () =>
    // `https://pokeapi.co/api/v2/pokemon?offset=${offset.value}&limit=${limit.value}`,
    `https://pokeapi.co/api/v2/pokemon?limit=${limit.value}`,
    // `https://pokeapi.co/api/v2/pokemon`,
  {
    default: () => [],
  },
  isDisplay.value = true,
);

// ポケモンをつかまえる
// "/trainer/:trainerName/pokemon"
const catchPokemon = async (pokemonName) => {
    const response = await $fetch(`/api/trainer/${trainerName.value}/pokemon`, {
        baseURL: config.public.backendOrigin,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: pokemonName,
        }),
    }).catch((e) => e);
    if (response instanceof Error) return;
    // console.log(response.pokemons[0].name);
    router.push(`/trainer/${trainerName.value}`);
};

// POST例 (new.vueより)
// const onSubmit = async () => {
//   const response = await $fetch("/api/trainer", {
//     baseURL: config.public.backendOrigin,
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       name: safeTrainerName.value,
//     }),
//   }).catch((e) => e);
//   if (response instanceof Error) return;
//   router.push(`/trainer/${safeTrainerName.value}`);
// };



// 最初に必ず実行される
onMounted(() => {
    const url = window.location.href; // 現在のURL取得
    const tmp = url.split('/');
    trainerName.value = decodeURI(tmp[tmp.length-2]); // 名前部分の切り出し
})

</script>

<template>
    <div>
        <h1>ポケモンをつかまえる</h1>
        <p>{{ pokemons.count }} しゅるいのポケモン</p>
        <div>
            <GamifyList v-show="isDisplay">
                <div>
                    <GamifyItem v-for="pokemon in pokemons.results" :key="pokemon.url">
                    <p>{{ pokemon.name }}</p>
                    <GamifyButton @click="catchPokemon(pokemon.name)">つかまえる</GamifyButton>
                </GamifyItem>
                </div>
            </GamifyList>
        </div>
    </div>
</template>
