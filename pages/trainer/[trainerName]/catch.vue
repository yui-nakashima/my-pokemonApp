<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const allPolemons = ref("");
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
// const getTrainer = async () => {
//     const response = await $fetch(`/api/trainer/${trainerName.value}`, {
//         baseURL: config.public.backendOrigin,
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     }).catch((e) => e);
//     if (response instanceof Error) return;
//     // console.log(response.pokemons[0].name);
//     trainersPokemons.value = response.pokemons;
//     console.log("***" + trainersPokemons.value);
//     isDisplay.value = true;
// };



// 最初に必ず実行される
onMounted(() => {
    // getPokemons();
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
                    <GamifyButton>つかまえる</GamifyButton>
                </GamifyItem>
                </div>
            </GamifyList>
        </div>
    </div>
</template>
