<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = ref("");
const isDisplay = ref(false); // 読み込み中はポケモンリストを表示しない

const limit = ref(200);
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
    router.push(`/trainer/${trainerName.value}`);
};

// 画像取得
// imgタグで変数を使用できないためURLに変換する関数
const generateImgPath = async(pokemonName) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokemonData = await response.json();

    const fileName = pokemonData.sprites.front_default;
    // console.log(fileName);
    return new URL(`${fileName}`, import.meta.url).href;
}

// 最初に必ず実行される
onMounted(() => {
    const url = window.location.href; // 現在のURL取得
    const tmp = url.split('/');
    trainerName.value = decodeURI(tmp[tmp.length - 2]); // 名前部分の切り出し
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
                        <img :src="generateImgPath(pokemon.name)"/>
                        <!-- <p>{{ generateImgPath(pokemon.name) }}</p> -->
                        <p>{{ pokemon.name }}</p>
                        <GamifyButton @click="catchPokemon(pokemon.name)">つかまえる</GamifyButton>
                    </GamifyItem>
                </div>
            </GamifyList>
        </div>
    </div>
</template>
