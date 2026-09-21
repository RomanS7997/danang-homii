import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {messages} from '../src/messages.js';
import {core} from '../src/translations-core.js';
import {landing} from '../src/translations-landing.js';
import {pages} from '../src/translations-pages.js';
import {enrichment} from '../src/enrichment-content.js';
const require=createRequire(import.meta.url);
const {parse}=require('@babel/parser');
const traverse=require('@babel/traverse').default;

test('Every Russian UI/content string has English and Vietnamese translations',()=>{
  const missing=[];
  for(const file of ['App.jsx','LandingSections.jsx','Pages.jsx','ExploreTools.jsx','LanguagePicker.jsx']){
    const ast=parse(fs.readFileSync(new URL(`../src/${file}`,import.meta.url),'utf8'),{sourceType:'module',plugins:['jsx']});
    traverse(ast,{
      StringLiteral(path){if(/[А-Яа-яЁё]/.test(path.node.value)&&!messages[path.node.value])missing.push(`${file}: ${path.node.value}`);},
      JSXText(path){assert.ok(!/[А-Яа-яЁё]/.test(path.node.value),`Untranslated JSX text in ${file}: ${path.node.value}`);}
    });
  }
  assert.deepEqual(missing,[]);
});
test('Translations preserve all interpolation fields and do not fall back to Russian',()=>{
  const placeholders=text=>[...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
  for(const [key,value] of Object.entries(messages))for(const lang of ['en','vi']){
    assert.ok(value[lang]?.trim(),`${lang}: ${key}`);
    assert.deepEqual(placeholders(value[lang]),placeholders(key),`${lang}: ${key}`);
    if(key!=='Русский · English · Tiếng Việt')assert.ok(!/[А-Яа-яЁё]/.test(value[lang]),`${lang}: ${key}`);
  }
});
test('Translation keys are unique across content modules',()=>{
  const rows=[...core,...landing,...pages,...enrichment];
  assert.equal(new Set(rows.map(row=>row[0])).size,rows.length);
});
