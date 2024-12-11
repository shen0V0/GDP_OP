/*:
 * @plugindesc contains 2 function
 * 1.Make an target unselectable with state that have <SP variable>nontargetable</SP variable> tag in the note box.
 * @param Targetable State Tag
 * @desc The tag used in the state note box to make enemies unselectable (e.g., <SP variable>nontargetable</SP variable>).
 * @type string
 * @default 
 * <SP variable>
 * nontargetable
 * </SP variable>
 */


(
    function() {
    var parameters = PluginManager.parameters('UnselectableState');
    var targetableTag = String(parameters['Targetable State Tag'] || '<SP variable>nontargetable</SP variable>');

    // Function to check if a state is "nontargetable"
    Game_Enemy.prototype.isSelectable = function() {
        
        // Check all states for the targetable tag
        for (var i = 0; i < this._states.length; i++) {
            var stateId = this._states[i];
            var state = $dataStates[stateId];
            if (state && state.note.includes(targetableTag)) {


                return false; // If the state contains the tag, make the enemy unselectable
            }
        }
        
        return true; // Enemy is selectable if no "nontargetable" state is found
    };

    // Override the targeting function to apply the custom isSelectable check
    var _Window_BattleEnemy_isCursorMovable = Window_BattleEnemy.prototype.isCursorMovable;
    Window_BattleEnemy.prototype.isCursorMovable = function() {
        var original = _Window_BattleEnemy_isCursorMovable.call(this);
        if (!original) return false;

        // Filter out enemies that are not selectable due to their states
        var selectableEnemies = $gameTroop.aliveMembers().filter(function(enemy) {
            var selectable = enemy.isSelectable();
            return selectable;
        });

        this._enemies = selectableEnemies;  // Update the list of selectable enemies
        return true;
    };
})();
