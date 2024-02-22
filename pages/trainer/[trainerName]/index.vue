<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = ref("");
const trainersPokemons = ref("");
const isDisplay = ref(false); // 読み込み中はポケモンリストを表示しない
const { dialog, onOpen, onClose } = useDialog();

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
    trainersPokemons.value = response.pokemons;
    isDisplay.value = true;
};

// トレーナーデータ削除
const delTrainer = async () => {
    const response = await $fetch(`/api/trainer/${trainerName.value}`, {
        baseURL: config.public.backendOrigin,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).catch((e) => e);
    router.push("/")
}

// マサラタウンに帰る（初期画面に遷移）
const moveTop = () => {
    router.push("/")
}

const moveCatch = () => {
    router.push(`/trainer/${trainerName.value}/catch`);
}

// imgタグで変数を使用できないためURLに変換する関数
const generateImgPath = (fileName) => {
    return new URL(`${fileName}`, import.meta.url).href;
}

// 最初に必ず実行される
onMounted(() => {
    const url = window.location.href; // 現在のURL取得
    const tmp = url.split('/');
    trainerName.value = decodeURI(tmp[tmp.length - 1]); // 名前部分の切り出し
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
        <GamifyButton @click="moveTop">マサラタウンに帰る</GamifyButton>
        <div>
            <h3>てもちポケモン</h3>
            <GamifyButton @click="moveCatch">ポケモンをつかまえる</GamifyButton>
            <GamifyList v-show="isDisplay">
                <div v-if="trainersPokemons == ''">
                    <p>ポケモンがいません</p>
                </div>
                <div v-else>
                    <GamifyItem v-for="pokemon in trainersPokemons" :key="pokemon.ID">
                        <img :src="generateImgPath(pokemon.sprites.front_default)" />
                        <p>{{ pokemon.name }}</p>
                        <p>Lv.{{ pokemon.level }}</p>
                    </GamifyItem>
                </div>
            </GamifyList>
        </div>
        <div>
            <GamifyButton @click="onOpen(true)">データをけす</GamifyButton>
            <GamifyDialog v-if="dialog" id="" title="かくにん" :description="`ほんとうに　けしますか？`" @close="onClose">
                <GamifyList direction="horizon">
                    <GamifyItem>
                        <GamifyButton @click="delTrainer">はい</GamifyButton>
                    </GamifyItem>
                    <GamifyItem>
                        <GamifyButton @click="onClose">いいえ</GamifyButton>
                    </GamifyItem>
                </GamifyList>
            </GamifyDialog>
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