/**
 * Created by Zdenda on 23.1.14.
 */

function save()
{
    var neco = $('#testInput').val();
    console.log(neco);
    window.localStorage.setItem("key", neco );
}
function load()
{
    var neco = window.localStorage.getItem("key");
    console.log(neco);
    $('#testInput').val(neco);
}