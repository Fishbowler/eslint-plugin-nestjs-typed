/* eslint-disable unicorn/prefer-module */
/* eslint-disable unicorn/prevent-abbreviations */

import rule from "./injectableShouldBeProvided";
import {ESLintUtils} from "@typescript-eslint/utils";

import {getFixturesRootDirectory} from "../../testing/fixtureSetup";
import path from "path";

const tsRootDirectory = getFixturesRootDirectory();
console.debug("Using tsrootdirectory", {tsRootDirectory});

const ruleTester = new ESLintUtils.RuleTester({
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2015,
        tsconfigRootDir: tsRootDirectory,
        project: "tsconfig-withMeta.json",
    },
});

ruleTester.run("injectable-should-be-provided", rule, {
    valid: [
        {
            // I've added a reference to this provider in the /fixtures/example.module.ts file so
            // it should not error
            code: `
            import {Injectable} from "./Injectable.stub";

            @Injectable()
            class ExampleProviderIncludedInModule {}
            
            export default ExampleProviderIncludedInModule;
            `,
            options: [
                {
                    src: [path.join(__dirname + "../../../fixtures", "*.ts")],
                    filterFromPaths: [
                        "node_modules",
                        ".test.",
                        ".spec.",
                        "file.ts",
                    ],
                },
            ],
        },
    ],
    invalid: [
        {
            // this provider is not included in the module's providers located in /fixtures
            code: `
        import {Injectable} from "./Injectable.stub";

        @Injectable()
        class ExampleProviderNOTInModule {}
        
        export default ExampleProviderNOTInModule;
        `,
            errors: [{messageId: "injectableInModule"}],
            options: [
                {
                    src: [path.join(__dirname + "../../../fixtures", "*.ts")],
                    filterFromPaths: [
                        "node_modules",
                        ".test.",
                        ".spec.",
                        "file.ts",
                    ],
                },
            ],
        },
    ],
});
