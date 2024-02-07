<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = ref("");
const trainersPokemons = ref("");
const isDisplay = ref(false); // 読み込み中はポケモンリストを表示しない

// トレーナーデータ取得
const getTrainer = async () => {
    const response = await $fetch(`/api/trainer/${trainerName.value}`, {
        baseURL: config.public.backendOrigin,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).catch((e) => e);
    if (response instanceof Error) return;
    // console.log(response.pokemons[0].name);
    trainersPokemons.value = response.pokemons;
    console.log("***" + trainersPokemons.value);
    isDisplay.value = true;
};

// マサラタウンに帰る
const moveMasala = () => {
    router.push("/")
}

const moveCatch = () => {
    router.push(`/trainer/${trainerName.value}/catch`);
}

// 最初に必ず実行される
onMounted(() => {
    const url = window.location.href; // 現在のURL取得
    const tmp = url.split('/');
    trainerName.value = decodeURI(tmp[tmp.length-1]); // 名前部分の切り出し
    getTrainer(); // トレーナーデータ取得
})

</script>

<template>
    <div>
        <h1>トレーナー情報</h1>
        <div class="item">
            <img src="/avatar.png" />
            &nbsp;
            <p>{{ trainerName }}</p>
        </div>
        <GamifyButton @click="moveMasala">マサラタウンに帰る</GamifyButton>
        <div>
            <h3>てもちポケモン</h3>
            <GamifyButton @click="moveCatch">ポケモンをつかまえる</GamifyButton>
            <GamifyList v-show="isDisplay">
                <div v-if="trainersPokemons == ''">
                    <p>ポケモンがいません</p>
                </div>
                <div v-else>
                    <GamifyItem v-for="pokemon in trainersPokemons" :key="pokemon.ID">
                    <p>{{ pokemon.name }}</p>
                </GamifyItem>
                </div>
            </GamifyList>
        </div>
    </div>
</template>

<style scoped>
img {
    width: 50px;
    height: 50px;
}

.item {
    display: flex;
}
</style>