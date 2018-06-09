const gulp = require("gulp");
const typescript = require("typescript");
const typescriptCompiler = require("gulp-typescript");
const del = require("del");
const merge = require("merge2");
const runSeq = require("run-sequence");

gulp.task("build-npm", ["build-npm-ts"], () => {
    return gulp.src(["!./src/themes/**/*.*", "./src/**/*.+(html|scss|png|woff|woff2|eot|ttf|svg)"])
        .pipe(gulp.dest("./dist/lib"));
});

gulp.task("build-npm-ts", ["build-clean"], (callback) => {
    const typescriptProject = typescriptCompiler.createProject("./tsconfig.json", {
        typescript: typescript
    });

    const tsResult = typescriptProject
        .src()
        .pipe(typescriptProject())

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest("./dist/lib")),
        tsResult.js.pipe(gulp.dest("./dist/lib"))
    ]);
});

gulp.task("build-clean", (done) => {
    return del(["dist/lib/**"], done);
});

gulp.task("build", (done) => runSeq("build-clean", "build-npm-ts", done));

gulp.task("default", ["build"]);

