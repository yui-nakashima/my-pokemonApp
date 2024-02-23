<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = ref("");
const isDisplay = ref(false); // 読み込み中はポケモンリストを表示しない
const { dialog, onOpen, onClose } = useDialog();
const page = ref(0);
const limit = ref(200);
const offset = computed(() => page.value * limit.value);
const { data: pokemons, refresh } = await useFetch(
    () =>
        `https://pokeapi.co/api/v2/pokemon?offset=${offset.value}&limit=${limit.value}`,
    // `https://pokeapi.co/api/v2/pokemon?limit=${limit.value}`,
    {
        default: () => [],
    },
    isDisplay.value = true,
);
const hasPrev = computed(() => page.value > 0);
const maxPage = computed(() => Math.floor(pokemons.value.count / limit.value));
const hasNext = computed(() => page.value < maxPage.value);
const onPrev = async () => {
    page.value--;
    await refresh();
};
const onNext = async () => {
    page.value++;
    await refresh();
};

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

// imgタグで変数を使用できないためURLに変換する関数
const generateImgPath = (pokeURL) => {
    const tmp = pokeURL.split('/')
    const num = tmp[tmp.length - 2];
    const fileName = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${num}.png`
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
        <p>{{ page + 1 }} / {{ maxPage + 1 }} ページ</p>
        <div>
            <GamifyList v-show="isDisplay">
                <div>
                    <GamifyItem v-for="pokemon in pokemons.results" :key="pokemon.url">
                        <img :src="generateImgPath(pokemon.url)" />
                        <span class="pokemon-name">{{ pokemon.name }}</span>
                        <GamifyButton @click="onOpen(pokemon.name)">つかまえる</GamifyButton>
                    </GamifyItem>
                </div>
            </GamifyList>
        </div>
        <div>
            <GamifyDialog v-if="dialog != null" id="" title="かくにん" :description="`${dialog}を　なかまにする？`" @close="onClose">
                <GamifyList direction="horizon">
                    <GamifyItem>
                        <GamifyButton @click="catchPokemon(dialog)">はい</GamifyButton>
                    </GamifyItem>
                    <GamifyItem>
                        <GamifyButton @click="onClose">いいえ</GamifyButton>
                    </GamifyItem>
                </GamifyList>
            </GamifyDialog>
        </div>
        <div>
            <GamifyList direction="horizon">
                <GamifyItem>
                    <GamifyButton :disabled="!hasPrev" @click="onPrev">まえへ</GamifyButton>
                </GamifyItem>
                <GamifyItem>
                    <span>{{ page+1 }} / {{ maxPage+1 }} ページ</span>
                </GamifyItem>
                <GamifyItem>
                    <GamifyButton :disabled="!hasNext" @click="onNext">つぎへ</GamifyButton>
                </GamifyItem>
            </GamifyList>
        </div>
    </div>
</template>
