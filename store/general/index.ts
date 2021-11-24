import { Module, VuexModule, Mutation } from "vuex-module-decorators"

@Module({ namespaced: true, name: "general", stateFactory: true })
export default class GeneralModule extends VuexModule {
    public coverImage: string = ''
    public snackbar: boolean = false
    public text: string = ''
    public color: string = ''
    public adminName: string = ''
    public permissions: any = {}

    @Mutation
    public setCoverImage(image: string) {
        this.coverImage = image
    }

    @Mutation
    public toggleSnackbar(status: boolean) {
        this.snackbar = status
    }
    @Mutation
    public setAdminName(name: string) {
        this.adminName = name
    }
    @Mutation
    public setSnackbarColor(color: string) {
        this.color = color
    }

    @Mutation
    public setSnackbarText(text: string) {
        this.text = text
    }

    @Mutation
    public setPermissions(allPer: any) {
        this.permissions = allPer
    }

    public get AdminName(): string {
        return this.adminName ? this.adminName : localStorage.getItem('user-name') + ' ' + localStorage.getItem('last_name')
    }
    public get coverImageData(): string {
        return this.coverImage
    }
    public get snackbarStatus() {
        return this.snackbar
    }
    public get snackbarColor() {
        return this.color
    }

    public get snackbarText() {
        return this.text
    }
}
