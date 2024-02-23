<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainer = ref("");
const trainerName = ref("");
const trainersPokemons = ref("");
const isDisplay = ref(false); // 読み込み中はポケモンリストを表示しない
const nickname = ref("");
const {
    dialog: deleteDialog,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
} = useDialog();
const {
    dialog: nicknameDialog,
    onOpen: onOpenNickname,
    onClose: onCloseNickname,
} = useDialog();
const {
    dialog: pokemonDialog,
    onOpen: onOpenPokemon,
    onClose: onClosePokemon,
} = useDialog();

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
    trainer.value = response;
    // trainersPokemons.value = response.pokemons;
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

// ニックネームをつける
const onNickname = async (pokemon) => {
    const newTrainer = trainer.value; // ここがないので困っている
    // const newTrainer = pokemons.value;
    const index = newTrainer.pokemons.findIndex(({ id }) => id === pokemon.id);
    // const index = newTrainer.findIndex(({ id }) => id === pokemon.id);
    newTrainer.pokemons[index].nickname = trimAvoidCharacters(nickname.value);
    // newTrainer[index].nickname = trimAvoidCharacters(nickname.value);
    nickname.value = "";
    const response = await $fetch(`/api/trainer/${trainerName.value}`, {
        baseURL: config.public.backendOrigin,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTrainer),
    }).catch((e) => e);
    if (response instanceof Error) return;
    onCloseNickname();
    // window.location.reload(); // リロードしなくても反映されるみたい.
};

// はかせにおくる（ポケモン削除）
const delPokemon = async (pokemonID) => {
    const response = await $fetch(`/api/trainer/${trainerName.value}/pokemon/${pokemonID}`, {
        baseURL: config.public.backendOrigin,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).catch((e) => e);
    // onClosePokemon(); // これがあるとリロードしない.
    window.location.reload();
}

// 画面遷移
const movePage = (path) => {
    router.push(path)
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
        <div class="trainer-info">
            <img src="/avatar.png" />
            <span>{{ trainerName }}</span>
        </div>
        <GamifyButton @click="movePage('/')">マサラタウンに帰る</GamifyButton>
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
                        <span class="pokemon-name">{{ pokemon.nickname || pokemon.name }}</span>
                        <span>Lv.{{ pokemon.level }}</span>
                        <GamifyButton @click="onOpenNickname(pokemon)">ニックネームをつける</GamifyButton>
                        <GamifyButton @click="onOpenPokemon(pokemon)">はかせにおくる</GamifyButton>
                    </GamifyItem>
                </div>
            </GamifyList>
        </div>
        <div class="dialog">
            <GamifyDialog v-if="nicknameDialog" id="confirm-nickname" title="ニックネーム"
                :description="`${nicknameDialog.name}　の　ニックネームは？`" @close="onCloseNickname">
                <div class="item">
                    <label for="name">ニックネーム</label>
                    <input id="name" v-model="nickname" @keydown.enter="onNickname(nicknameDialog)" />
                </div>
                <GamifyList :border="false" direction="horizon">
                    <GamifyItem>
                        <GamifyButton @click="onCloseNickname">キャンセル</GamifyButton>
                    </GamifyItem>
                    <GamifyItem>
                        <GamifyButton @click="onNickname(nicknameDialog)">けってい</GamifyButton>
                    </GamifyItem>
                </GamifyList>
            </GamifyDialog>

            <GamifyDialog v-if="pokemonDialog != null" id="confirm-DELETE-pokemon" title="かくにん" :description="`${pokemonDialog.name}　を　はかせに　おくりますか？`" @close="onClosePokemon">
                <GamifyList :border="false" direction="horizon">
                    <GamifyItem>
                        <GamifyButton @click="delPokemon(pokemonDialog.id)">はい</GamifyButton>
                    </GamifyItem>
                    <GamifyItem>
                        <GamifyButton @click="onClosePokemon">いいえ</GamifyButton>
                    </GamifyItem>
                </GamifyList>
            </GamifyDialog>

            <GamifyButton @click="onOpenDelete(true)">データをけす</GamifyButton>
            <GamifyDialog v-if="deleteDialog" id="confirm-DELETE-trainer" title="かくにん" :description="`ほんとうに　けしますか？`"
                @close="onCloseDelete">
                <GamifyList :border="false" direction="horizon">
                    <GamifyItem>
                        <GamifyButton @click="delTrainer">はい</GamifyButton>
                    </GamifyItem>
                    <GamifyItem>
                        <GamifyButton @click="onCloseDelete">いいえ</GamifyButton>
                    </GamifyItem>
                </GamifyList>
            </GamifyDialog>
        </div>
    </div>
</template>

<style scoped>
.gamify-item:hover img {
    animation: bounce;
    animation-duration: 0.8s;
    animation-iteration-count: infinite;
}

.trainer-info>img {
    width: 3rem;
    height: 3rem;
}

.trainer-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
</style>